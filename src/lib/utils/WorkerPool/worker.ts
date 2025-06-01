import { MIMETypes } from '../../../types/types';
import BMPToBlob from './worker_decoders/BMPToBlob';
import HEICToBlob from './worker_decoders/HEICToBlob';
import JPEG_WEBP_PNG_ToBlob from './worker_decoders/JPEG_WEBP_PNG_ToBlob';
import SVGToBlob from './worker_decoders/SVGToBlob';
import TIFFPagesToBlobs from './worker_decoders/TIFFPagesToBlobs';

addEventListener('message', async (e) => {
  const { type, outputSettings, targetFormatName, blobURL, transferable } = e.data;
  console.log(e.data);

  try {
    switch (type) {
      case MIMETypes.JPG:
      case MIMETypes.PNG:
      case MIMETypes.WEBP:
        {
          const blob = await JPEG_WEBP_PNG_ToBlob(blobURL, outputSettings, targetFormatName);

          postMessage(blob);
        }
        break;

      case MIMETypes.BMP:
        {
          const blob = await BMPToBlob(blobURL, outputSettings, targetFormatName);

          postMessage(blob);
        }
        break;

      case MIMETypes.HEIC:
        {
          const blob = await HEICToBlob(blobURL, outputSettings, targetFormatName);

          postMessage(blob);
        }
        break;

      case MIMETypes.SVG:
        {
          const blob = await SVGToBlob(outputSettings, targetFormatName, transferable);

          postMessage(blob);
        }
        break;

      case MIMETypes.TIFF:
        {
          const blobs = await TIFFPagesToBlobs(blobURL, outputSettings, targetFormatName);

          postMessage(blobs);
        }
        break;
    }
  } catch (err) {
    setTimeout(() => {
      throw err;
    });
  }
});
