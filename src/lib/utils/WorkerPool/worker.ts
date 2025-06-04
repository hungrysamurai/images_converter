import { MIMETypes, OutputFileFormatsNames } from '../../../types/types';
import GIFPagesToBlobs from '../../decoders/multiPage/GIFPagesToBlobs';
import PDFPagesToBlobs from '../../decoders/multiPage/PDFPagesToBlobs';
import TIFFPagesToBlobs from '../../decoders/multiPage/TIFFPagesToBlobs';
import BMPToBlob from '../../decoders/singlePage/BMPToBlob';
import HEICToBlob from '../../decoders/singlePage/HEICToBlob';
import JPEG_WEBP_PNG_ToBlob from '../../decoders/singlePage/JPEG_WEBP_PNG_ToBlob';
import SVGToBlob from '../../decoders/singlePage/SVGToBlob';

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
      case MIMETypes.WEBP:
        result = await JPEG_WEBP_PNG_ToBlob(blobURL, outputSettings, targetFormatName);
        break;

      case MIMETypes.BMP:
        result = await BMPToBlob(blobURL, outputSettings, targetFormatName);
        break;

      case MIMETypes.HEIC:
        result = await HEICToBlob(blobURL, outputSettings, targetFormatName);
        break;

      case MIMETypes.SVG:
        if (!bitmap) throw new Error('Missing bitmap for SVG conversion');
        result = await SVGToBlob(outputSettings, targetFormatName, bitmap);
        break;

      case MIMETypes.TIFF:
        result = await TIFFPagesToBlobs(blobURL, outputSettings, targetFormatName);
        break;

      case MIMETypes.PDF:
        if (!inputSettings) throw new Error('Missing inputSettings for PDF conversion');
        result = await PDFPagesToBlobs(blobURL, outputSettings, targetFormatName, inputSettings);
        break;

      case MIMETypes.GIF:
        result = await GIFPagesToBlobs(blobURL, outputSettings, targetFormatName);
        break;

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
