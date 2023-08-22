import { bmpToFile } from "./bmpToFile";
import { heicToFile } from "./heicToFile";
import { jpegPngWebpToFile } from "./jpegPngWebpToFile";

export const processSinglePageFile = async (
  source,
  targetFormatSettings,
  activeTargetFormatName,
  inputSettings
) => {
  return new Promise((resolve, reject) => {
    const { blobURL, type } = source;
    switch (type) {
      case "image/jpeg":
      case "image/png":
      case "image/webp":
        {
          jpegPngWebpToFile(
            blobURL,
            type,
            targetFormatSettings,
            activeTargetFormatName,
            inputSettings
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
          bmpToFile(blobURL, targetFormatSettings)
            .then((blob) => {
              resolve(blob);
            })
            .catch((err) => {
              reject(new Error("Failed to process image:", err));
            });
        }
        break;
      case "image/heic": {
        heicToFile(blobURL, targetFormatSettings)
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
