import { MIMETypes, OutputFileFormatsNames } from "../../../types/types";

import BMPToFile from "./BMPToFile";
import HEICToFile from "./HEIICToFile";
import JPEG_WEBP_PNG_ToFile from "./JPEG_WEBP_PNG_ToFile";

const processSinglePageFile = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  mergeToOne: boolean,
  collection: MergeCollection
): Promise<Blob | void> => {
  const { blobURL, type: srcType } = source;

  switch (srcType) {
    case MIMETypes.JPG:
    case MIMETypes.PNG:
    case MIMETypes.WEBP: {
      const processed = await JPEG_WEBP_PNG_ToFile(
        blobURL,
        targetFormatSettings,
        activeTargetFormatName,
        mergeToOne
      );

      if (processed instanceof HTMLCanvasElement) {
        collection.push(processed)
      } else {
        return processed
      }
    }
      break;

    case MIMETypes.BMP: {
      const processed = await BMPToFile(
        blobURL,
        targetFormatSettings,
        activeTargetFormatName,
        mergeToOne
      );

      if (processed instanceof HTMLCanvasElement) {
        collection.push(processed)
      } else {
        return processed
      }
    }
      break;

    case MIMETypes.HEIC: {
      const processed = await HEICToFile(
        blobURL,
        targetFormatSettings,
        activeTargetFormatName,
        mergeToOne
      );

      if (processed instanceof HTMLCanvasElement) {
        collection.push(processed)
      } else {
        return processed
      }
    }
      break;
  }
};


export default processSinglePageFile;