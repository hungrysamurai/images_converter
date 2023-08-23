import { encodeJpgPngWebp } from "./encoders/encodeJpgPngWebp";
import { encodeBmp } from "./encoders/encodeBmp";
import { encodeTiff } from "./encoders/encodeTiff";
import { encodeGif } from "./encoders/encodeGif";
import { encodePdf } from "./encoders/encodePdf";

export const encode = async (
  canvas,
  targetFormatSettings,
  activeTargetFormatName
) => {
  switch (activeTargetFormatName) {
    case "jpeg":
    case "webp":
    case "png":
      {
        try {
          return encodeJpgPngWebp(
            canvas,
            targetFormatSettings,
            activeTargetFormatName
          );
        } catch (err) {
          console.log(err);
        }
      }
      break;

    case "bmp":
      {
        try {
          return encodeBmp(
            canvas,
            targetFormatSettings
          );
        } catch (err) {
          console.log(err);
        }
      }
      break;

    case "tiff":
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

    case "gif":
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

    case "pdf":
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
