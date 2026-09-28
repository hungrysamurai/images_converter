import { nanoid } from '@reduxjs/toolkit';
import { addConvertedFile } from '../store/slices/processFilesSlice/processFilesSlice';
import type { AppDispatch } from '../store/store';
import { MIME, type MIMEType, type OutputFormat } from '@/types/formats';
import SVGToBitmap from './utils/SVGToBitmap';

import { getFileFormat } from './utils/getFileFormat';
import WorkerPool from './utils/WorkerPool/WorkerPool';
import type { ConvertTask, ConvertTaskResult } from './utils/WorkerPool/types';
import type {
  OutputConversionSettings,
  PDFInputSettings,
} from '@/store/slices/conversionSettingsSlice/types';
import type { SourceFile } from '@/types/files';

export default class Converter {
  private collection: Blob[] = [];
  private workerPool = new WorkerPool<ConvertTask, ConvertTaskResult>();
  private processTasks: Promise<Blob | Blob[] | void>[] = [];

  // TODO: DRY decoders functions into ONE
  constructor(
    private outputSettings: OutputConversionSettings,
    private activeTargetFormatName: OutputFormat,
    private inputSettings: {
      pdf: PDFInputSettings;
    },
    private UIDispatcher: AppDispatch,
    private mergeToOne: boolean,
  ) {}

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
    switch (this.activeTargetFormatName) {
      case 'pdf':
        {
          const mergePDF = await import('@/lib/aggregators/pdf');

          const merged = await mergePDF.default(this.collection);

          const URL = window.URL.createObjectURL(merged);
          this.UIDispatcher(
            addConvertedFile({
              blobURL: URL,
              downloadLink: URL,
              name: `Merged-${Date.now()}`,
              size: merged.size,
              type: MIME[this.activeTargetFormatName],
              id: nanoid(),
            }),
          );
        }
        break;

      case 'gif':
        {
          const mergeGIF = await import('@/lib/aggregators/gif');

          const merged = await mergeGIF.default(this.collection, this.outputSettings);

          const URL = window.URL.createObjectURL(merged);
          this.UIDispatcher(
            addConvertedFile({
              blobURL: URL,
              downloadLink: URL,
              name: `Merged-${Date.now()}`,
              size: merged.size,
              type: MIME[this.activeTargetFormatName],
              id: nanoid(),
            }),
          );
        }
        break;
    }
  }

  private async processFile(file: SourceFile): Promise<Blob | Blob[] | void> {
    const { blobURL, type, name } = file;

    switch (file.type) {
      case MIME.jpeg:
      case MIME.png:
      case MIME.webp:
      case MIME.bmp:
      case MIME.svg:
      case MIME.heic:
        {
          const processed = await this.processSinglePageFile(blobURL, type, name);
          if (processed) {
            if (!this.mergeToOne) {
              const { name, id } = file;

              const size = processed.size;
              const URL = window.URL.createObjectURL(processed);

              this.UIDispatcher(
                addConvertedFile({
                  blobURL: URL,
                  downloadLink: URL,
                  name,
                  size,
                  type: MIME[this.activeTargetFormatName],
                  id: nanoid(),
                  sourceId: id,
                }),
              );
            }
            return processed;
          }
        }
        break;

      case MIME.tiff:
      case MIME.gif:
      case MIME.pdf: {
        const processedPages = await this.processMultiPageFile(blobURL, type, name);

        if (Array.isArray(processedPages) && processedPages.length > 0) {
          if (!this.mergeToOne) {
            for (const [index, blobPage] of processedPages.entries()) {
              const { name, id } = file;

              const size = blobPage.size;
              const URL = window.URL.createObjectURL(blobPage);

              this.UIDispatcher(
                addConvertedFile({
                  blobURL: URL,
                  downloadLink: URL,
                  name: `${name}_${index + 1}`,
                  size,
                  type: MIME[this.activeTargetFormatName],
                  id: nanoid(),
                  sourceId: id,
                }),
              );
            }
          }

          return processedPages;
        }
      }
    }
  }

  // Single page

  private async processSinglePageFile(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob | void> {
    switch (type) {
      case MIME.jpeg:
      case MIME.png:
      case MIME.webp: {
        return this.convertJPEG_WEBP_PNG(blobURL, type, fileName);
      }

      case MIME.bmp: {
        return this.convertBMP(blobURL, type, fileName);
      }

      case MIME.heic: {
        return this.convertHEIC(blobURL, type, fileName);
      }

      case MIME.svg: {
        return this.convertSVG(blobURL, type, fileName);
      }

      default: {
        throw new Error(`Unknown file format: ${type}`);
      }
    }
  }

  private async convertJPEG_WEBP_PNG(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob | void> {
    try {
      const processedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
        },
      });

      return processedInWorker as Blob;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeJPEG_PNG_WEBP = await import('@/lib/decoders/singlePage/jpeg_webp_png');

        const processed = await decodeJPEG_PNG_WEBP.default(
          blobURL,
          this.outputSettings,
          this.activeTargetFormatName,
        );

        return processed;
      } catch (err) {
        console.error(
          `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in main thread: ${(err as Error).message}`,
        );
        throw err;
      }
    }
  }

  private async convertBMP(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob | void> {
    try {
      const processedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
        },
      });

      return processedInWorker as Blob;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeBMP = await import('@/lib/decoders/singlePage/bmp');

        const processed = await decodeBMP.default(
          blobURL,
          this.outputSettings,
          this.activeTargetFormatName,
        );

        return processed;
      } catch (err) {
        console.error(
          `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in main thread: ${(err as Error).message}`,
        );
        throw err;
      }
    }
  }

  private async convertHEIC(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob | void> {
    try {
      const processedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
        },
      });
      return processedInWorker as Blob;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeHEIC = await import('@/lib/decoders/singlePage/heic');

        const processed = await decodeHEIC.default(
          blobURL,
          this.outputSettings,
          this.activeTargetFormatName,
        );

        return processed;
      } catch (err) {
        console.error(
          `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in main thread: ${(err as Error).message}`,
        );
        throw err;
      }
    }
  }

  private async convertSVG(
    blobURL: string,
    type: MIMEType,
    fileName: string,
  ): Promise<Blob | void> {
    try {
      const bitmap = await SVGToBitmap(blobURL, this.outputSettings);

      const processedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
          bitmap,
        },
        transfer: [bitmap],
      });

      return processedInWorker as Blob;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeSVGBitmap = await import('@/lib/decoders/singlePage/svg');

        const bitmap = await SVGToBitmap(blobURL, this.outputSettings);

        const processed = await decodeSVGBitmap.default(
          this.outputSettings,
          this.activeTargetFormatName,
          bitmap,
        );

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
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
        },
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeTIFF = await import('@/lib/decoders/multiPage/tiff');

        const pagesBlobs = await decodeTIFF.default(
          blobURL,
          this.outputSettings,
          this.activeTargetFormatName,
        );

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
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
          inputSettings: this.inputSettings,
        },
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodePDF = await import('@/lib/decoders/multiPage/pdf');

        const pagesBlobs = await decodePDF.default(
          blobURL,
          this.outputSettings,
          this.activeTargetFormatName,
          this.inputSettings,
        );

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
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
        },
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeGIF = await import('@/lib/decoders/multiPage/gif');
        const pagesBlobs = await decodeGIF.default(
          blobURL,
          this.outputSettings,
          this.activeTargetFormatName,
        );

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
