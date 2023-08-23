import { bmpToFile } from "./bmpToFile";
import { heicToFile } from "./heicToFile";
import { jpegPngWebpToFile } from "./jpegPngWebpToFile";

export const processSinglePageFile = async (
  source,
  targetFormatSettings,
  activeTargetFormatName
) => {
  return new Promise((resolve, reject) => {
    const { blobURL, type: srcType } = source;
    switch (srcType) {
      case "image/jpeg":
      case "image/png":
      case "image/webp":
        {
          jpegPngWebpToFile(
            blobURL,
            srcType,
            targetFormatSettings,
            activeTargetFormatName,
          )
            .then((blob) => {
              resolve(blob);
            })
            .catch((err) => {
              reject(new Error("Failed to process image:", err));
            });
        }
        break;

      case "image/bmp":
        {
          bmpToFile(blobURL, targetFormatSettings, activeTargetFormatName)
            .then((blob) => {
              resolve(blob);
            })
            .catch((err) => {
              reject(new Error("Failed to process image:", err));
            });
        }
        break;
      case "image/heic": {
        heicToFile(blobURL, targetFormatSettings, activeTargetFormatName)
          .then((blob) => {
            resolve(blob);
          })
          .catch((err) => {
            reject(new Error("Failed to process image:", err));
          });
      }
    }
  });
};
