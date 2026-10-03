import { nanoid } from '@reduxjs/toolkit';
import { addConvertedFile } from '@/store/slices/processFilesSlice/processFilesSlice';
import type { AppDispatch } from '@/store/store';
import { MIME } from '@/types/formats';

import { getFileFormat } from '@/lib/utils/getFileFormat';
import WorkerPool from '@/lib/utils/WorkerPool';
import type { ConvertTask, WorkerResponse } from './types';
import { getOutputFormatEntry, shouldMerge } from './outputFormats';
import { getInputFormatEntry } from './inputFormats';
import ConversionWorker from './worker?worker';
import runPipeline from './pipeline';
import type { InputSettings, OutputTarget } from '@/store/slices/conversionSettingsSlice/types';
import type { SourceFile } from '@/types/files';

const getPoolSize = (target: OutputTarget) => {
  const defaultSize = Math.max(navigator.hardwareConcurrency - 1, 1);
  const { maxConcurrency } = getOutputFormatEntry(target);

  return maxConcurrency ? Math.min(defaultSize, maxConcurrency) : defaultSize;
};

export default class Converter {
  private readonly workerPool: WorkerPool<ConvertTask, WorkerResponse>;
  private readonly mergeToOne: boolean;
  private readonly mainThreadFallback: boolean;

  constructor(
    private readonly target: OutputTarget,
    private readonly inputSettings: InputSettings,
    private UIDispatcher: AppDispatch,
  ) {
    this.workerPool = new WorkerPool(() => new ConversionWorker(), getPoolSize(target));
    this.mergeToOne = shouldMerge(target);
    this.mainThreadFallback = getOutputFormatEntry(target).mainThreadFallback ?? true;
  }

  public async convert(sourceFiles: SourceFile[]): Promise<void> {
    // A failed file must not block the others
    const results = await Promise.allSettled(sourceFiles.map((file) => this.processFile(file)));

    if (!this.mergeToOne) return;

    const collection = results.flatMap((result) =>
      result.status === 'fulfilled' ? result.value : [],
    );

    if (collection.length > 0) {
      await this.merge(collection);
    }
  }

  private async merge(blobs: Blob[]) {
    const loadAggregator = getOutputFormatEntry(this.target).loadAggregator;
    if (!loadAggregator) return;

    const aggregate = await loadAggregator();
    const merged = await aggregate(blobs, this.target.settings);

    this.dispatchConvertedFile(merged, `Merged-${Date.now()}`);
  }

  private async processFile(file: SourceFile): Promise<Blob[]> {
    const blobs = await this.runTask(file);

    if (!this.mergeToOne) {
      blobs.forEach((blob, index) =>
        this.dispatchConvertedFile(
          blob,
          blobs.length > 1 ? `${file.name}_${index + 1}` : file.name,
          file.id,
        ),
      );
    }

    return blobs;
  }

  private dispatchConvertedFile(blob: Blob, name: string, sourceId?: string) {
    const URL = window.URL.createObjectURL(blob);

    this.UIDispatcher(
      addConvertedFile({
        blobURL: URL,
        downloadLink: URL,
        name,
        size: blob.size,
        type: MIME[this.target.format],
        id: nanoid(),
        sourceId,
      }),
    );
  }

  // Falls back to main thread only when the worker itself fails, not the file,
  // and only if the target format allows it
  private async runTask({ blobURL, type, name }: SourceFile): Promise<Blob[]> {
    const task: ConvertTask = {
      type,
      blobURL,
      target: this.target,
      inputSettings: this.inputSettings,
    };
    const format = getFileFormat(type).toUpperCase();
    const prepare = getInputFormatEntry(type)?.prepare;

    const bitmap = prepare && (await prepare(task));
    let response: WorkerResponse;

    try {
      response = await this.workerPool.addWork({
        data: { ...task, bitmap },
        transfer: bitmap ? [bitmap] : undefined,
      });
    } catch (err) {
      const message = (err as ErrorEvent).message;

      if (!this.mainThreadFallback) {
        console.error(`Worker failed on ${format} file '${name}': ${message}`);
        throw new Error(message, { cause: err });
      }

      console.error(
        `Worker failed on ${format} file '${name}': ${message}. Trying to process in main thread...`,
      );

      try {
        // Bitmap sent to the worker is detached, prepare it again
        const bitmap = prepare && (await prepare(task));

        return await runPipeline({ ...task, bitmap });
      } catch (err) {
        console.error(
          `Failed to process ${format} file '${name}' in main thread: ${(err as Error).message}`,
        );
        throw err;
      }
    }

    if (!response.ok) {
      console.error(`Failed to process ${format} file '${name}': ${response.message}`);
      throw new Error(response.message);
    }

    return response.blobs;
  }

  public dispose() {
    this.workerPool.dispose();
  }
}
