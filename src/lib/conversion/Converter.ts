import { nanoid } from '@reduxjs/toolkit';
import { addConvertedFile } from '@/store/slices/processFilesSlice/processFilesSlice';
import type { AppDispatch } from '@/store/store';
import { MIME, type MIMEType } from '@/types/formats';
import SVGToBitmap from './prepare/SVGToBitmap';

import { getFileFormat } from '@/lib/utils/getFileFormat';
import WorkerPool from '@/lib/utils/WorkerPool';
import type { ConvertTask, ConvertTaskResult } from './types';
import ConversionWorker from './worker?worker';
import type { OutputTarget, PDFInputSettings } from '@/store/slices/conversionSettingsSlice/types';
import type { SourceFile } from '@/types/files';

export default class Converter {
  private collection: Blob[] = [];
  private workerPool = new WorkerPool<ConvertTask, ConvertTaskResult>(() => new ConversionWorker());
  private processTasks: Promise<Blob | Blob[] | void>[] = [];
  private readonly mergeToOne: boolean;

  // TODO: DRY decoders functions into ONE
  constructor(
    private readonly target: OutputTarget,
    private readonly pdfInputSettings: PDFInputSettings,
    private UIDispatcher: AppDispatch,
  ) {
    this.mergeToOne = 'merge' in target.settings && target.settings.merge;
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
    switch (this.target.format) {
      case 'pdf':
        {
          const mergePDF = await import('@/lib/conversion/aggregators/pdf');

          const merged = await mergePDF.default(this.collection);

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
        break;

      case 'gif':
        {
          const mergeGIF = await import('@/lib/conversion/aggregators/gif');

          const merged = await mergeGIF.default(this.collection, this.target);

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
                  type: MIME[this.target.format],
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
                  type: MIME[this.target.format],
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
          target: this.target,
        },
      });

      return processedInWorker as Blob;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeJPEG_PNG_WEBP =
          await import('@/lib/conversion/decoders/singlePage/jpeg_webp_png');

        const processed = await decodeJPEG_PNG_WEBP.default(blobURL, this.target);

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
          target: this.target,
        },
      });

      return processedInWorker as Blob;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeBMP = await import('@/lib/conversion/decoders/singlePage/bmp');

        const processed = await decodeBMP.default(blobURL, this.target);

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
          target: this.target,
        },
      });
      return processedInWorker as Blob;
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
      );

      try {
        const decodeHEIC = await import('@/lib/conversion/decoders/singlePage/heic');

        const processed = await decodeHEIC.default(blobURL, this.target);

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
      const bitmap = await SVGToBitmap(blobURL, this.target);

      const processedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          target: this.target,
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
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          target: this.target,
        },
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
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
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          target: this.target,
          pdfInputSettings: this.pdfInputSettings,
        },
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
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
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        data: {
          type,
          blobURL,
          target: this.target,
        },
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error(
        `Failed to process ${getFileFormat(type).toUpperCase()} file '${fileName}' in worker: ${(err as ErrorEvent).message}.Trying to process in main thread...`,
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
