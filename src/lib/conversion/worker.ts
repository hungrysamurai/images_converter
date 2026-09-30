import { MIME } from '@/types/formats';
import type { ConvertTask, ConvertTaskResult } from './types';

self.addEventListener('message', async (e: MessageEvent<ConvertTask>) => {
  const { type, blobURL, target, pdfInputSettings, bitmap } = e.data;

  try {
    let result: ConvertTaskResult;

    switch (type) {
      case MIME.jpeg:
      case MIME.png:
      case MIME.webp: {
        const decodeJPEG_WEBP_PNG =
          await import('@/lib/conversion/decoders/singlePage/jpeg_webp_png');

        result = await decodeJPEG_WEBP_PNG.default(blobURL, target);

        break;
      }

      case MIME.bmp: {
        const decodeBMP = await import('@/lib/conversion/decoders/singlePage/bmp');

        result = await decodeBMP.default(blobURL, target);

        break;
      }

      case MIME.heic: {
        const decodeHEIC = await import('@/lib/conversion/decoders/singlePage/heic');

        result = await decodeHEIC.default(blobURL, target);

        break;
      }

      case MIME.svg: {
        if (!bitmap) throw new Error('Missing bitmap for SVG conversion');

        const decodeSVGBitmap = await import('@/lib/conversion/decoders/singlePage/svg');

        result = await decodeSVGBitmap.default(target, bitmap);
        break;
      }

      case MIME.tiff: {
        const TIFFPagesToBlobs = await import('@/lib/conversion/decoders/multiPage/tiff');

        result = await TIFFPagesToBlobs.default(blobURL, target);

        break;
      }

      case MIME.pdf: {
        if (!pdfInputSettings) throw new Error('Missing pdfInputSettings for PDF conversion');
        const PDFPagesToBlobs = await import('@/lib/conversion/decoders/multiPage/pdf');

        result = await PDFPagesToBlobs.default(blobURL, target, pdfInputSettings);
        break;
      }

      case MIME.gif: {
        const decodeGIF = await import('@/lib/conversion/decoders/multiPage/gif');

        result = await decodeGIF.default(blobURL, target);
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
