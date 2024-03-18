import { MIMETypes, OutputFileFormatsNames } from "../../../types/types";

import { bmpToFile } from "./bmpToFile";
import { heicToFile } from "./heicToFile";
import { jpegPngWebpToFile } from "./jpegPngWebpToFile";

export const processSinglePageFile = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames
): Promise<Blob | void> => {
  const { blobURL, type: srcType } = source;

  switch (srcType) {
    case MIMETypes.JPG:
    case MIMETypes.PNG:
    case MIMETypes.WEBP: {
      return jpegPngWebpToFile(
        blobURL,
        targetFormatSettings,
        activeTargetFormatName
      );
    }

    case MIMETypes.BMP: {
      return bmpToFile(blobURL, targetFormatSettings, activeTargetFormatName);
    }
    case MIMETypes.HEIC: {
      return heicToFile(blobURL, targetFormatSettings, activeTargetFormatName);
    }
  }
};
