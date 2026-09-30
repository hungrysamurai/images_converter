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
import type { OutputTarget, PDFInputSettings } from '@/store/slices/conversionSettingsSlice/types';
import type { SourceFile } from '@/types/files';

export default class Converter {
  private collection: Blob[] = [];
  private workerPool = new WorkerPool<ConvertTask, WorkerResponse>(() => new ConversionWorker());
  private processTasks: Promise<Blob | Blob[] | void>[] = [];
  private readonly mergeToOne: boolean;

  // TODO: DRY decoders functions into ONE
  constructor(
    private readonly target: OutputTarget,
    private readonly pdfInputSettings: PDFInputSettings,
    private UIDispatcher: AppDispatch,
  ) {
    this.mergeToOne = shouldMerge(target);
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
        const processedPages = await this.processMultiPageFile(blobURL, type, name);

        if (Array.isArray(processedPages) && processedPages.length > 0) {
          if (!this.mergeToOne) {
            processedPages.forEach((blobPage, index) =>
              this.dispatchConvertedFile(blobPage, `${name}_${index + 1}`, id),
            );
          }

          return processedPages;
        }
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
    const task: ConvertTask = { type, blobURL, target: this.target };
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
        { type, blobURL, target: this.target, bitmap },
        [bitmap],
      );

      return processedInWorker;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as Error).message}. Trying to process in main thread...`,
      );

      try {
        const decodeSVGBitmap = await import('@/lib/conversion/decoders/singlePage/svg');

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

  // Multi page

  private async processMultiPageFile(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob[] | void> {
    switch (type) {
      case MIME.tiff: {
        const pagesBlobs = await this.convertTIFF(blobURL, type, fileName);
        return pagesBlobs;
      }
      case MIME.pdf: {
        const pagesBlobs = await this.convertPDF(blobURL, type, fileName);
        return pagesBlobs;
      }
      case MIME.gif: {
        const pagesBlobs = await this.convertGIF(blobURL, type, fileName);
        return pagesBlobs;
      }

      default: {
        throw new Error(`Unknown file format: ${type}`);
      }
    }
  }

  private async convertTIFF(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob[] | void> {
    try {
      return await this.runInWorker({ type, blobURL, target: this.target });
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as Error).message}. Trying to process in main thread...`,
      );

      try {
        const decodeTIFF = await import('@/lib/conversion/decoders/multiPage/tiff');

        const pagesBlobs = await decodeTIFF.default(blobURL, this.target);

        return pagesBlobs;
      } catch (err) {
        console.error(
          `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in main thread: ${(err as Error).message}`,
        );
        throw err;
      }
    }
  }

  private async convertPDF(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob[] | void> {
    try {
      return await this.runInWorker({
        type,
        blobURL,
        target: this.target,
        pdfInputSettings: this.pdfInputSettings,
      });
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as Error).message}. Trying to process in main thread...`,
      );

      try {
        const decodePDF = await import('@/lib/conversion/decoders/multiPage/pdf');

        const pagesBlobs = await decodePDF.default(blobURL, this.target, this.pdfInputSettings);

        return pagesBlobs;
      } catch (err) {
        console.error(
          `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in main thread: ${(err as Error).message}`,
        );
        throw err;
      }
    }
  }

  private async convertGIF(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob[] | void> {
    try {
      return await this.runInWorker({ type, blobURL, target: this.target });
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as Error).message}. Trying to process in main thread...`,
      );

      try {
        const decodeGIF = await import('@/lib/conversion/decoders/multiPage/gif');
        const pagesBlobs = await decodeGIF.default(blobURL, this.target);

        return pagesBlobs;
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
