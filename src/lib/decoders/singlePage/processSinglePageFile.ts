import { MIMETypes, OutputFileFormatsNames } from '../../../types/types';

import BMPToFile from './BMPToFile';
import HEICToFile from './HEICToFile';
import JPEG_WEBP_PNG_ToFile from './JPEG_WEBP_PNG_ToFile';
import SVGToFile from './SVGToFile';

const processSinglePageFile = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  mergeToOne: boolean,
  collection: MergeCollection,
): Promise<Blob | void> => {
  const { blobURL, type: srcType } = source;

  switch (srcType) {
    case MIMETypes.JPG:
    case MIMETypes.PNG:
    case MIMETypes.WEBP:
      {
        const processed = await JPEG_WEBP_PNG_ToFile(
          blobURL,
          targetFormatSettings,
          activeTargetFormatName,
          mergeToOne,
        );

        if (processed instanceof HTMLCanvasElement) {
          collection.push(processed);
        } else {
          return processed;
        }
      }
      break;

    case MIMETypes.BMP:
      {
        const processed = await BMPToFile(
          blobURL,
          targetFormatSettings,
          activeTargetFormatName,
          mergeToOne,
        );

        if (processed instanceof HTMLCanvasElement) {
          collection.push(processed);
        } else {
          return processed;
        }
      }
      break;

    case MIMETypes.HEIC:
      {
        const processed = HEICToFile(
          blobURL,
          targetFormatSettings,
          activeTargetFormatName,
          mergeToOne,
        );

        if (processed instanceof HTMLCanvasElement) {
          collection.push(processed);
        } else {
          return processed;
        }
      }
      break;

    case MIMETypes.SVG:
      {
        const processed = await SVGToFile(
          blobURL,
          targetFormatSettings,
          activeTargetFormatName,
          mergeToOne,
        );

        if (processed instanceof HTMLCanvasElement) {
          collection.push(processed);
        } else {
          return processed;
        }
      }
      break;
  }
};

export default processSinglePageFile;
