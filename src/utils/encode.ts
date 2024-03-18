import { OutputFileFormatsNames } from "../types";

import { encodeJpgPngWebp } from "./encoders/encodeJpgPngWebp";
import { encodeBmp } from "./encoders/encodeBmp";
import { encodeTiff } from "./encoders/encodeTiff";
import { encodeGif } from "./encoders/encodeGif";
import { encodePdf } from "./encoders/encodePdf";

export const encode = (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames
): Promise<Blob> | void => {
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
        try {
          return encodeTiff(
            canvas,
            targetFormatSettings,
            activeTargetFormatName
          );
        } catch (err) {
          console.log(err);
        }
      }
      break;

    case OutputFileFormatsNames.GIF:
      {
        {
          try {
            return encodeGif(
              canvas,
              targetFormatSettings,
              activeTargetFormatName
            );
          } catch (err) {
            console.log(err);
          }
        }
      }
      break;

    case OutputFileFormatsNames.PDF:
      {
        {
          try {
            return encodePdf(
              canvas,
              targetFormatSettings,
              activeTargetFormatName
            );
          } catch (err) {
            console.log(err);
          }
        }
      }
      break;
  }
};
