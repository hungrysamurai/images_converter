import { MIMETypes, OutputFileFormatsNames } from "../../../types";
import { bmpToFile } from "./bmpToFile";
import { heicToFile } from "./heicToFile";
import { jpegPngWebpToFile } from "./jpegPngWebpToFile";

export const processSinglePageFile = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const { blobURL, type: srcType } = source;

    switch (srcType) {
      case MIMETypes.JPG:
      case MIMETypes.PNG:
      case MIMETypes.WEBP:
        {
          jpegPngWebpToFile(
            blobURL,
            srcType,
            targetFormatSettings,
            activeTargetFormatName,
          )
            .then((blob) => {
              // throw Error('error from processSinglePageFile')
              resolve(blob);
            })
            .catch((err) => {
              console.log(2);
              reject(err);
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
