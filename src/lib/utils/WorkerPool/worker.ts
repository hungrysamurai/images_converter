import { MIMETypes } from '../../../types/types';
import GIFPagesToBlobs from '../../decoders/multiPage/GIFPagesToBlobs';
import PDFPagesToBlobs from '../../decoders/multiPage/PDFPagesToBlobs';
import TIFFPagesToBlobs from '../../decoders/multiPage/TIFFPagesToBlobs';
import BMPToBlob from '../../decoders/singlePage/BMPToBlob';
import HEICToBlob from '../../decoders/singlePage/HEICToBlob';
import JPEG_WEBP_PNG_ToBlob from '../../decoders/singlePage/JPEG_WEBP_PNG_ToBlob';
import SVGToBlob from '../../decoders/singlePage/SVGToBlob';

addEventListener('message', async (e) => {
  const { type, outputSettings, targetFormatName, blobURL, transferable, inputSettings } = e.data;

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

      case MIMETypes.PDF:
        {
          const blobs = await PDFPagesToBlobs(
            blobURL,
            outputSettings,
            targetFormatName,
            inputSettings,
          );

          postMessage(blobs);
        }
        break;

      case MIMETypes.GIF:
        {
          const blobs = await GIFPagesToBlobs(blobURL, outputSettings, targetFormatName);

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
