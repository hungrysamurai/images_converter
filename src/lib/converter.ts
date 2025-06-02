import { nanoid } from '@reduxjs/toolkit';
import { addConvertedFile } from '../store/slices/processFilesSlice/processFilesSlice';
import { AppDispatch } from '../store/store';
import { MIMETypes, OutputFileFormatsNames } from '../types/types';
import GIFPagesToBlobs from './decoders/multiPage/GIFPagesToBlobs';
import PDFPagesToBlobs from './decoders/multiPage/PDFPagesToBlobs';
import TIFFPagesToBlobs from './decoders/multiPage/TIFFPagesToBlobs';
import BMPToBlob from './decoders/singlePage/BMPToBlob';
import HEICToBlob from './decoders/singlePage/HEICToBlob';
import JPEG_WEBP_PNG_ToBlob from './decoders/singlePage/JPEG_WEBP_PNG_ToBlob';
import SVGToBlob from './decoders/singlePage/SVGToBlob';
import { getScaledSVGDimensions } from './utils/getScaledSVGDimensions';
import WorkerPool from './utils/WorkerPool/WorkerPool';

export default class Converter {
  private collection: Blob[] = [];
  private workerPool = new WorkerPool();
  private processTasks: Promise<Blob | Blob[] | void>[] = [];

  constructor(
    private outputSettings: OutputConversionSettings,
    private activeTargetFormatName: OutputFileFormatsNames,
    private inputSettings: {
      [OutputFileFormatsNames.PDF]: PDFInputSettings;
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

            this.UIDispatcher(
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

          this.UIDispatcher(
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

      case MIMETypes.HEIC: {
        return this.convertHEIC(blobURL, type);
      }

      case MIMETypes.SVG: {
        return this.convertSVG(blobURL, type);
      }

      default: {
        throw new Error(`Unknown file format: ${type}`);
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
      console.error(`Failed to process ${type} file in worker: ${(err as ErrorEvent).message}`);
      // try process file in main thread
      const processed = await JPEG_WEBP_PNG_ToBlob(
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
      console.error(`Failed to process BMP in worker: ${(err as ErrorEvent).message}`);

      const processed = await BMPToBlob(blobURL, this.outputSettings, this.activeTargetFormatName);

      return processed;
    }
  }

  private async convertHEIC(blobURL: string, type: MIMETypes): Promise<Blob> {
    try {
      const processedInWorker = await this.workerPool.addWork({
        type,
        blobURL,
        outputSettings: this.outputSettings,
        targetFormatName: this.activeTargetFormatName,
      });
      return processedInWorker as Blob;
    } catch (err) {
      console.error(`Failed to process HEIC in worker: ${(err as ErrorEvent).message}`);

      const processed = await HEICToBlob(blobURL, this.outputSettings, this.activeTargetFormatName);

      return processed;
    }
  }

  private async convertSVG(blobURL: string, type: MIMETypes): Promise<Blob> {
    const bitmap = await this.SVGToBitmap(blobURL);

    try {
      const processedInWorker = await this.workerPool.addWork({
        type,
        blobURL,
        outputSettings: this.outputSettings,
        targetFormatName: this.activeTargetFormatName,
        transferable: bitmap,
      });
      return processedInWorker as Blob;
    } catch (err) {
      console.error(`Failed to process SVG in worker: ${(err as ErrorEvent).message}`);

      const processed = await SVGToBlob(this.outputSettings, this.activeTargetFormatName, bitmap);

      return processed;
    }
  }

  private async SVGToBitmap(blobURL: string): Promise<ImageBitmap> {
    let svgBlobURL;

    const { resize, units, targetHeight, targetWidth } = this.outputSettings;

    // Parse SVG
    const file = await fetch(blobURL);
    const svgText = await file.text();

    const svgEl = new DOMParser().parseFromString(svgText, MIMETypes.SVG)
      .documentElement as unknown as SVGSVGElement;

    // Figuring out dimensions of given SVG
    let currentWidth, currentHeight;

    const widthAttribute = svgEl.getAttribute('width');
    const heightAttribute = svgEl.getAttribute('height');

    if (widthAttribute) {
      currentWidth = parseInt(widthAttribute);
    }

    if (heightAttribute) {
      currentHeight = parseInt(heightAttribute);
    }

    if (!currentWidth || !currentHeight) {
      // Trying to get viewBox...
      const viewBox = svgEl.getAttribute('viewBox');

      if (viewBox) {
        const viewBoxValues = viewBox.split(' ');
        const viewBoxWidth = viewBoxValues[2];
        const viewBoxHeight = viewBoxValues[3];

        currentWidth = Number(viewBoxWidth);
        currentHeight = Number(viewBoxHeight);
      } else {
        // If viewBox missing & there is no width-height - just place svg in DOM and get width and height
        document.body.appendChild(svgEl);

        if (svgEl.isConnected) {
          const bbox = svgEl.getBBox();

          currentWidth = Math.round(bbox.width);
          currentHeight = Math.round(bbox.height);
        }

        svgEl.setAttribute('viewBox', `0 0 ${currentWidth} ${currentHeight}`);

        // Cleanup
        document.body.removeChild(svgEl);
      }
    }

    if (
      !currentWidth ||
      !currentHeight ||
      typeof currentHeight !== 'number' ||
      typeof currentWidth !== 'number'
    ) {
      throw new Error('Failed to load SVG dimensions!');
    }

    if (resize && (targetWidth || targetHeight)) {
      // Scale SVG
      const targetDimensions = getScaledSVGDimensions(
        currentHeight,
        currentWidth,
        units,
        targetWidth,
        targetHeight,
      );

      svgEl.setAttribute('width', targetDimensions.width);
      svgEl.setAttribute('height', targetDimensions.height);

      currentWidth = parseInt(targetDimensions.width);
      currentHeight = parseInt(targetDimensions.height);

      // Convert SVG element to a data URL
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });

      svgBlobURL = URL.createObjectURL(svgBlob);
    } else {
      svgEl.setAttribute('width', `${currentWidth}`);
      svgEl.setAttribute('height', `${currentHeight}`);

      // Convert SVG element to a data URL
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });

      svgBlobURL = URL.createObjectURL(svgBlob);
    }

    const img = new Image();
    img.src = svgBlobURL;
    await img.decode();

    const bmp = await createImageBitmap(img, 0, 0, currentWidth, currentHeight, {
      resizeHeight: currentHeight,
      resizeWidth: currentWidth,
    });

    // If SVG was resized
    if (svgBlobURL !== blobURL) {
      URL.revokeObjectURL(svgBlobURL);
    }
    return bmp;
  }

  // Multi page

  private async processMultiPageFile(blobURL: string, type: MIMETypes): Promise<Blob[]> {
    switch (type) {
      case MIMETypes.TIFF: {
        const pagesBlobs = await this.convertTIFF(blobURL, type);
        return pagesBlobs;
      }
      case MIMETypes.PDF: {
        const pagesBlobs = await this.convertPDF(blobURL, type);
        return pagesBlobs;
      }
      case MIMETypes.GIF: {
        const pagesBlobs = await this.convertGIF(blobURL, type);
        return pagesBlobs;
      }

      default: {
        throw new Error(`Unknown file format: ${type}`);
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
      console.error(`Failed to process TIFF in worker: ${(err as ErrorEvent).message}`);

      const pagesBlobs = await TIFFPagesToBlobs(
        blobURL,
        this.outputSettings,
        this.activeTargetFormatName,
      );

      return pagesBlobs;
    }
  }

  private async convertPDF(blobURL: string, type: MIMETypes): Promise<Blob[]> {
    try {
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        type,
        blobURL,
        outputSettings: this.outputSettings,
        targetFormatName: this.activeTargetFormatName,
        inputSettings: this.inputSettings,
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error(`Failed to process PDF in worker: ${(err as ErrorEvent).message}`);

      const pagesBlobs = await PDFPagesToBlobs(
        blobURL,
        this.outputSettings,
        this.activeTargetFormatName,
        this.inputSettings,
      );
      return pagesBlobs;
    }
  }

  private async convertGIF(blobURL: string, type: MIMETypes): Promise<Blob[]> {
    try {
      const pagesBlobsProcessedInWorker = await this.workerPool.addWork({
        type,
        blobURL,
        outputSettings: this.outputSettings,
        targetFormatName: this.activeTargetFormatName,
      });

      return pagesBlobsProcessedInWorker as Blob[];
    } catch (err) {
      console.error(`Failed to process GIF in worker: ${(err as ErrorEvent).message}`);

      const pagesBlobs = await GIFPagesToBlobs(
        blobURL,
        this.outputSettings,
        this.activeTargetFormatName,
      );

      return pagesBlobs;
    }
  }

  public dispose() {
    this.workerPool.dispose();
  }
}
