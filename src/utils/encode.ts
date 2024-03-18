import { OutputFileFormatsNames } from "../types/types";

import { encodeJpgPngWebp } from "./encoders/encodeJpgPngWebp";
import { encodeBmp } from "./encoders/encodeBmp";
import { encodeTiff } from "./encoders/encodeTiff";
import { encodeGif } from "./encoders/encodeGif";
import { encodePdf } from "./encoders/encodePdf";

export const encode = (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames
): Promise<Blob | void> => {
  switch (activeTargetFormatName) {
    case OutputFileFormatsNames.JPG:
    case OutputFileFormatsNames.WEBP:
    case OutputFileFormatsNames.PNG: {
      return encodeJpgPngWebp(
        canvas,
        targetFormatSettings,
        activeTargetFormatName
      );
    }
    case OutputFileFormatsNames.BMP: {
      return encodeBmp(canvas, targetFormatSettings);
    }

    case OutputFileFormatsNames.TIFF:
      {
        return encodeTiff(
          canvas,
          targetFormatSettings
        );
      }

    case OutputFileFormatsNames.GIF:
      {
        return encodeGif(
          canvas,
          targetFormatSettings
        )
      }
    case OutputFileFormatsNames.PDF:
      {
        return encodePdf(
          canvas,
          targetFormatSettings
        );
      }
  }
};
