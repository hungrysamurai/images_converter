import { MIMETypes, OutputFileFormatsNames } from '../../../types/types';

interface WorkerMessage {
  type: MIMETypes;
  blobURL: string;
  outputSettings: OutputConversionSettings;
  targetFormatName: OutputFileFormatsNames;
  inputSettings?: {
    [OutputFileFormatsNames.PDF]: PDFInputSettings;
  };
  bitmap?: ImageBitmap;
}

type WorkerResult = Blob | Blob[];

self.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const { type, blobURL, outputSettings, targetFormatName, inputSettings, bitmap } = e.data;

  try {
    let result: WorkerResult;

    switch (type) {
      case MIMETypes.JPG:
      case MIMETypes.PNG:
      case MIMETypes.WEBP: {
        const decodeJPEG_WEBP_PNG = await import('../../decoders/singlePage/jpeg_webp_png');

        result = await decodeJPEG_WEBP_PNG.default(blobURL, outputSettings, targetFormatName);

        break;
      }

      case MIMETypes.BMP: {
        const decodeBMP = await import('../../decoders/singlePage/bmp');

        result = await decodeBMP.default(blobURL, outputSettings, targetFormatName);

        break;
      }

      case MIMETypes.HEIC: {
        const decodeHEIC = await import('@/lib/decoders/singlePage/heic');

        result = await decodeHEIC.default(blobURL, outputSettings, targetFormatName);

        break;
      }

      case MIMETypes.SVG: {
        if (!bitmap) throw new Error('Missing bitmap for SVG conversion');

        const decodeSVGBitmap = await import('../../decoders/singlePage/svg');

        result = await decodeSVGBitmap.default(outputSettings, targetFormatName, bitmap);
        break;
      }

      case MIMETypes.TIFF: {
        const TIFFPagesToBlobs = await import('../../decoders/multiPage/TIFFPagesToBlobs');

        result = await TIFFPagesToBlobs.default(blobURL, outputSettings, targetFormatName);

        break;
      }

      case MIMETypes.PDF: {
        if (!inputSettings) throw new Error('Missing inputSettings for PDF conversion');
        const PDFPagesToBlobs = await import('../../decoders/multiPage/PDFPagesToBlobs');

        result = await PDFPagesToBlobs.default(
          blobURL,
          outputSettings,
          targetFormatName,
          inputSettings,
        );
        break;
      }

      case MIMETypes.GIF: {
        const GIFPagesToBlobs = await import('../../decoders/multiPage/GIFPagesToBlobs');

        result = await GIFPagesToBlobs.default(blobURL, outputSettings, targetFormatName);
        break;
      }

      default:
        throw new Error(`Unsupported file type: ${type}`);
    }

    postMessage(result);
  } catch (err) {
    setTimeout(() => {
      throw err;
    });
  }
});
