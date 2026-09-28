import { MIME } from '@/types/formats';
import type { ConvertTask, ConvertTaskResult } from './types';

self.addEventListener('message', async (e: MessageEvent<ConvertTask>) => {
  const { type, blobURL, outputSettings, targetFormatName, inputSettings, bitmap } = e.data;

  try {
    let result: ConvertTaskResult;

    switch (type) {
      case MIME.jpeg:
      case MIME.png:
      case MIME.webp: {
        const decodeJPEG_WEBP_PNG = await import('@/lib/decoders/singlePage/jpeg_webp_png');

        result = await decodeJPEG_WEBP_PNG.default(blobURL, outputSettings, targetFormatName);

        break;
      }

      case MIME.bmp: {
        const decodeBMP = await import('@/lib/decoders/singlePage/bmp');

        result = await decodeBMP.default(blobURL, outputSettings, targetFormatName);

        break;
      }

      case MIME.heic: {
        const decodeHEIC = await import('@/lib/decoders/singlePage/heic');

        result = await decodeHEIC.default(blobURL, outputSettings, targetFormatName);

        break;
      }

      case MIME.svg: {
        if (!bitmap) throw new Error('Missing bitmap for SVG conversion');

        const decodeSVGBitmap = await import('@/lib/decoders/singlePage/svg');

        result = await decodeSVGBitmap.default(outputSettings, targetFormatName, bitmap);
        break;
      }

      case MIME.tiff: {
        const TIFFPagesToBlobs = await import('@/lib/decoders/multiPage/tiff');

        result = await TIFFPagesToBlobs.default(blobURL, outputSettings, targetFormatName);

        break;
      }

      case MIME.pdf: {
        if (!inputSettings) throw new Error('Missing inputSettings for PDF conversion');
        const PDFPagesToBlobs = await import('@/lib/decoders/multiPage/pdf');

        result = await PDFPagesToBlobs.default(
          blobURL,
          outputSettings,
          targetFormatName,
          inputSettings,
        );
        break;
      }

      case MIME.gif: {
        const decodeGIF = await import('@/lib/decoders/multiPage/gif');

        result = await decodeGIF.default(blobURL, outputSettings, targetFormatName);
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
