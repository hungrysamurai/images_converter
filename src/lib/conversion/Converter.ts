import { nanoid } from '@reduxjs/toolkit';
import { addConvertedFile } from '@/store/slices/processFilesSlice/processFilesSlice';
import type { AppDispatch } from '@/store/store';
import { MIME, type MIMEType } from '@/types/formats';
import SVGToBitmap from './prepare/SVGToBitmap';

import { getFileFormat } from '@/lib/utils/getFileFormat';
import WorkerPool from '@/lib/utils/WorkerPool';
import type { ConvertTask, WorkerResponse } from './types';
import { getOutputFormatEntry, shouldMerge } from './outputFormats';
import ConversionWorker from './worker?worker';
import runPipeline from './pipeline';
import type {
  InputSettings,
  OutputTarget,
  PDFInputSettings,
} from '@/store/slices/conversionSettingsSlice/types';
import type { SourceFile } from '@/types/files';

export default class Converter {
  private collection: Blob[] = [];
  private workerPool = new WorkerPool<ConvertTask, WorkerResponse>(() => new ConversionWorker());
  private processTasks: Promise<Blob | Blob[] | void>[] = [];
  private readonly mergeToOne: boolean;
  private readonly inputSettings: InputSettings;

  // TODO: DRY decoders functions into ONE
  constructor(
    private readonly target: OutputTarget,
    pdfInputSettings: PDFInputSettings,
    private UIDispatcher: AppDispatch,
  ) {
    this.mergeToOne = shouldMerge(target);
    // TODO: store will pass the whole input settings object
    this.inputSettings = { pdf: pdfInputSettings };
  }

  public async convert(sourceFiles: SourceFile[]): Promise<void> {
    for (const source of sourceFiles) {
      const task = this.processFile(source);
      this.processTasks.push(task);
    }

    if (this.mergeToOne) {
      const tasksQueue = await Promise.allSettled(this.processTasks);

      tasksQueue.forEach((blob) => {
        if (blob.status === 'fulfilled' && blob.value) {
          if (Array.isArray(blob.value)) {
            blob.value.forEach((blob) => this.collection.push(blob));
          } else {
            this.collection.push(blob.value);
          }
        }
      });

      if (this.collection.length > 0) {
        await this.merge();
      }
    } else {
      await Promise.allSettled(this.processTasks);
    }
  }

  private async merge() {
    const loadAggregator = getOutputFormatEntry(this.target).loadAggregator;
    if (!loadAggregator) return;

    const aggregate = await loadAggregator();
    const merged = await aggregate(this.collection, this.target.settings);

    const URL = window.URL.createObjectURL(merged);
    this.UIDispatcher(
      addConvertedFile({
        blobURL: URL,
        downloadLink: URL,
        name: `Merged-${Date.now()}`,
        size: merged.size,
        type: MIME[this.target.format],
        id: nanoid(),
      }),
    );
  }

  private async processFile(file: SourceFile): Promise<Blob | Blob[] | void> {
    const { blobURL, type, name, id } = file;

    switch (file.type) {
      case MIME.jpeg:
      case MIME.png:
      case MIME.webp:
      case MIME.bmp:
      case MIME.heic: {
        const blobs = await this.convertInPipeline(file);

        if (!this.mergeToOne) {
          blobs.forEach((blob) => this.dispatchConvertedFile(blob, name, id));
        }

        return blobs;
      }

      case MIME.svg: {
        const processed = await this.convertSVG(blobURL, type, name);

        if (processed && !this.mergeToOne) {
          this.dispatchConvertedFile(processed, name, id);
        }

        return processed;
      }

      case MIME.tiff:
      case MIME.gif:
      case MIME.pdf: {
        const pages = await this.convertInPipeline(file);

        if (!this.mergeToOne) {
          pages.forEach((page, index) =>
            this.dispatchConvertedFile(page, `${name}_${index + 1}`, id),
          );
        }

        return pages;
      }
    }
  }

  private dispatchConvertedFile(blob: Blob, name: string, sourceId: string) {
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

  private async runInWorker(task: ConvertTask, transfer?: Transferable[]): Promise<Blob[]> {
    const response = await this.workerPool.addWork({ data: task, transfer });

    if (!response.ok) throw new Error(response.message);

    return response.blobs;
  }

  // Falls back to main thread only when the worker itself fails, not the file
  private async convertInPipeline({ blobURL, type, name }: SourceFile): Promise<Blob[]> {
    const task: ConvertTask = {
      type,
      blobURL,
      target: this.target,
      inputSettings: this.inputSettings,
    };
    const format = getFileFormat(type).toUpperCase();

    let response: WorkerResponse;

    try {
      response = await this.workerPool.addWork({ data: task });
    } catch (err) {
      console.error(
        `Worker failed on ${format} file '${name}': ${(err as ErrorEvent).message}. Trying to process in main thread...`,
      );

      try {
        return await runPipeline(task);
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

  // Legacy decoders

  private async convertSVG(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob | void> {
    try {
      const bitmap = await SVGToBitmap(blobURL, this.target);

      const [processedInWorker] = await this.runInWorker(
        { type, blobURL, target: this.target, inputSettings: this.inputSettings, bitmap },
        [bitmap],
      );

      return processedInWorker;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as Error).message}. Trying to process in main thread...`,
      );

      try {
        const decodeSVGBitmap = await import('@/lib/conversion/decoders/svg');

        const bitmap = await SVGToBitmap(blobURL, this.target);

        const processed = await decodeSVGBitmap.default(this.target, bitmap);

        return processed;
      } catch (err) {
        console.error(
          `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in main thread: ${(err as Error).message}`,
        );
        throw err;
      }
    }
  }

  public dispose() {
    this.workerPool.dispose();
  }
}
