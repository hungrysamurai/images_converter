import { nanoid } from '@reduxjs/toolkit';
import { addConvertedFile } from '../../store/slices/processFilesSlice/processFilesSlice';
import { AppDispatch } from '../../store/store';
import { MIMETypes, OutputFileFormatsNames } from '../../types/types';
import TIFFToFiles from '../decoders/multiPage/TIFFToFiles';
import BMPToFile from '../decoders/singlePage/BMPToFile';
import JPEG_WEBP_PNG_ToFile from '../decoders/singlePage/JPEG_WEBP_PNG_ToFile';
import WorkerPool from '../utils/WorkerPool/WorkerPool';

export default class Converter {
  collection: Blob[] = [];

  workerPool = new WorkerPool();
  processTasks: Promise<Blob | Blob[] | void>[] = [];

  constructor(
    public outputSettings: OutputConversionSettings,
    public activeTargetFormatName: OutputFileFormatsNames,
    public inputSettings: {
      [OutputFileFormatsNames.PDF]: PDFInputSettings;
    },
    public dispatch: AppDispatch,
    public mergeToOne: boolean,
  ) {}

  public async convert(sourceFiles: SourceFile[]): Promise<void> {
    for (const source of sourceFiles) {
      const task = this.processFile(source);
      this.processTasks.push(task);
    }

    if (this.mergeToOne) {
      const blobs = await Promise.allSettled(this.processTasks);

      blobs.forEach((blob) => {
        if (blob.status === 'fulfilled') {
          if (Array.isArray(blob.value)) {
            blob.value.forEach((blob) => this.collection.push(blob));
          } else {
            this.collection.push(blob.value as Blob);
          }
        }
      });
    } else {
      const taskQueue = await Promise.allSettled(this.processTasks);
      console.log(taskQueue);
    }
  }

  private async processFile(file: SourceFile): Promise<Blob | Blob[] | void> {
    const { blobURL, type } = file;

    switch (file.type) {
      case MIMETypes.JPG:
      case MIMETypes.PNG:
      case MIMETypes.WEBP:
      case MIMETypes.BMP:
      case MIMETypes.SVG:
      case MIMETypes.HEIC:
        {
          const processed = await this.processSinglePageFile(blobURL, type);

          if (processed) {
            const { name, id } = file;

            const size = processed.size;
            const URL = window.URL.createObjectURL(processed);

            this.dispatch(
              addConvertedFile({
                blobURL: URL,
                downloadLink: URL,
                name,
                size,
                type: `image/${this.activeTargetFormatName}` as MIMETypes,
                id: nanoid(),
                sourceId: id,
              }),
            );

            return processed;
          }
        }
        break;

      case MIMETypes.TIFF:
      case MIMETypes.GIF:
      case MIMETypes.PDF: {
        const processedPages = await this.processMultiPageFile(blobURL, type);

        for (const [index, blobPage] of processedPages.entries()) {
          const { name, id } = file;

          const size = blobPage.size;
          const URL = window.URL.createObjectURL(blobPage);

          this.dispatch(
            addConvertedFile({
              blobURL: URL,
              downloadLink: URL,
              name: `${name}_${index + 1}`,
              size,
              type: `image/${this.activeTargetFormatName}` as MIMETypes,
              id: nanoid(),
              sourceId: id,
            }),
          );
        }

        return processedPages;
      }
    }
  }

  // Single page

  private async processSinglePageFile(blobURL: string, type: MIMETypes): Promise<Blob> {
    switch (type) {
      case MIMETypes.JPG:
      case MIMETypes.PNG:
      case MIMETypes.WEBP: {
        return this.convertJPEG_WEBP_PNG(blobURL, type);
      }

      case MIMETypes.BMP: {
        return this.convertBMP(blobURL, type);
      }
    }
  }

  private async convertJPEG_WEBP_PNG(blobURL: string, type: MIMETypes): Promise<Blob> {
    // If no need of strict order...
    try {
      // try process files with Workers
      const processedInWorker = await this.workerPool.addWork({
        type,
        blobURL,
        outputSettings: this.outputSettings,
        targetFormatName: this.activeTargetFormatName,
      });

      return processedInWorker as Blob;
    } catch (err) {
      console.error((err as ErrorEvent).message);
      // try process file in main thread
      const processed = await JPEG_WEBP_PNG_ToFile(
        blobURL,
        this.outputSettings,
        this.activeTargetFormatName,
      );

      return processed;
    }
  }

  private async convertBMP(blobURL: string, type: MIMETypes): Promise<Blob> {
    try {
      const processedInWorker = await this.workerPool.addWork({
        type,
        blobURL,
        outputSettings: this.outputSettings,
        targetFormatName: this.activeTargetFormatName,
      });

      return processedInWorker as Blob;
    } catch (err) {
      console.error((err as ErrorEvent).message);
      const processed = await BMPToFile(blobURL, this.outputSettings, this.activeTargetFormatName);

      return processed;
    }
  }

  private async convertHEIC(blobURL: string, type: MIMETypes): Promise<void> {
    try {
      const processedInWorker = await this.workerPool.addWork({
        type,
        blobURL,
        outputSettings: this.outputSettings,
        targetFormatName: this.activeTargetFormatName,
      });
      return processedInWorker as Blob;
    } catch (err) {}

    console.log(blob);
  }

  // Multi page

  private async processMultiPageFile(blobURL: string, type: MIMETypes): Promise<Blob[]> {
    switch (type) {
      case MIMETypes.TIFF: {
        const pagesBlobs = await this.convertTIFF(blobURL, type);
        return pagesBlobs;
      }
    }
  }

  private async convertTIFF(blobURL: string, type: MIMETypes): Promise<Blob[]> {
    try {
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        type,
        blobURL,
        outputSettings: this.outputSettings,
        targetFormatName: this.activeTargetFormatName,
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error((err as ErrorEvent).message);

      const pagesBlobs = await TIFFToFiles(
        blobURL,
        this.outputSettings,
        this.activeTargetFormatName,
      );

      return pagesBlobs;
    }
  }
}
