import { MIMETypes, OutputFileFormatsNames } from "../../../types/types";

import { bmpToFile } from "./bmpToFile";
import { heicToFile } from "./heicToFile";
import { jpegPngWebpToFile } from "./jpegPngWebpToFile";

export const processSinglePageFile = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  compileToOne: boolean,
  collection: CompileCollection
): Promise<Blob | void> => {
  const { blobURL, type: srcType } = source;

  switch (srcType) {
    case MIMETypes.JPG:
    case MIMETypes.PNG:
    case MIMETypes.WEBP: {
      const processed = await jpegPngWebpToFile(
        blobURL,
        targetFormatSettings,
        activeTargetFormatName,
        compileToOne
      );

      if (processed instanceof HTMLCanvasElement) {
        collection.push(processed)
      } else {
        return processed
      }
    }
      break;

    case MIMETypes.BMP: {
      const processed = await bmpToFile(
        blobURL,
        targetFormatSettings,
        activeTargetFormatName,
        compileToOne
      );

      if (processed instanceof HTMLCanvasElement) {
        collection.push(processed)
      } else {
        return processed
      }
    }
      break;

    case MIMETypes.HEIC: {
      const processed = await heicToFile(
        blobURL,
        targetFormatSettings,
        activeTargetFormatName,
        compileToOne
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
