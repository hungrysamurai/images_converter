import { OutputFileFormatsNames } from "../types/types";

import encodeJPEG_PNG_WEBP from "./encoders/encodeJPEG_PNG_WEBP";
import encodeBMP from "./encoders/encodeBMP";
import encodeTIFF from "./encoders/encodeTIFF";
import encodeGIF from "./encoders/encodeGIF";
import encodePDF from "./encoders/encodePDF";

export const encode = (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames
): Promise<Blob | void> => {
  switch (activeTargetFormatName) {
    case OutputFileFormatsNames.JPG:
    case OutputFileFormatsNames.WEBP:
    case OutputFileFormatsNames.PNG: {
      return encodeJPEG_PNG_WEBP(
        canvas,
        targetFormatSettings,
        activeTargetFormatName
      );
    }
    case OutputFileFormatsNames.BMP: {
      return encodeBMP(canvas);
    }

    case OutputFileFormatsNames.TIFF:
      {
        return encodeTIFF(canvas);
      }

    case OutputFileFormatsNames.GIF:
      {
        return encodeGIF(
          canvas,
          targetFormatSettings
        )
      }
    case OutputFileFormatsNames.PDF:
      {
        return encodePDF(
          canvas,
          targetFormatSettings
        );
      }
  }
};
