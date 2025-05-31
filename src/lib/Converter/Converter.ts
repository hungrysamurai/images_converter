import { nanoid } from '@reduxjs/toolkit';
import { addConvertedFile } from '../../store/slices/processFilesSlice/processFilesSlice';
import { AppDispatch } from '../../store/store';
import { MIMETypes, OutputFileFormatsNames } from '../../types/types';
import BMPToFile from '../decoders/singlePage/BMPToFile';
import JPEG_WEBP_PNG_ToFile from '../decoders/singlePage/JPEG_WEBP_PNG_ToFile';
import WorkerPool from '../utils/WorkerPool/WorkerPool';

export default class Converter {
  collection: MergeCollection = [];

  workerPool = new WorkerPool();
  processTasks: Promise<void>[] = [];

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

    await Promise.allSettled(this.processTasks);

    if (this.mergeToOne) {
      console.log(this.collection);
    }
  }

  private async processFile(file: SourceFile): Promise<void> {
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

          if (processed instanceof Blob) {
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
          } else if (processed instanceof HTMLCanvasElement) {
            this.collection.push(processed);
          }
        }
        break;

      case MIMETypes.TIFF:
      case MIMETypes.GIF:
      case MIMETypes.PDF:
        {
          await this.processMultiPageFile(blobURL);
        }
        break;
    }
  }

  private async processSinglePageFile(
    blobURL: string,
    type: MIMETypes,
  ): Promise<void | Blob | HTMLCanvasElement> {
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

  private async convertJPEG_WEBP_PNG(blobURL: string, type: MIMETypes) {
    if (!this.mergeToOne) {
      // If no need of strict order...
      try {
        // try process files with Workers
        const blob = await this.workerPool.addWork({
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
        });
        return blob;
      } catch (err) {
        // try process file in main thread
        const processed = await JPEG_WEBP_PNG_ToFile(
          blobURL,
          this.outputSettings,
          this.activeTargetFormatName,
          this.mergeToOne,
        );

        return processed;
      }
    } else {
      const processed = await JPEG_WEBP_PNG_ToFile(
        blobURL,
        this.outputSettings,
        this.activeTargetFormatName,
        this.mergeToOne,
      );

      return processed;
    }
  }

  private async convertBMP(blobURL: string, type: MIMETypes) {
    if (!this.mergeToOne) {
      try {
        const blob = await this.workerPool.addWork({
          type,
          blobURL,
          outputSettings: this.outputSettings,
          targetFormatName: this.activeTargetFormatName,
        });

        return blob;
      } catch (err) {
        const processed = await BMPToFile(
          blobURL,
          this.outputSettings,
          this.activeTargetFormatName,
          this.mergeToOne,
        );

        return processed;
      }
    } else {
      const processed = await BMPToFile(
        blobURL,
        this.outputSettings,
        this.activeTargetFormatName,
        this.mergeToOne,
      );

      return processed;
    }
  }

  private async processMultiPageFile(blobURL: string) {}

  private async convertHEIC(blobURL: string): Promise<void> {
    const file = await fetch(blobURL);
    const arrayBuffer = await file.arrayBuffer();

    const blob = await this.workerPool.addWork({
      type: 'decode_heic',
      payload: arrayBuffer,
      outputSettings: this.outputSettings,
      targetFormatName: this.activeTargetFormatName,
    });

    console.log(blob);
  }
}
