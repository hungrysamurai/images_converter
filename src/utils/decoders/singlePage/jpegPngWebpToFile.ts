import { OutputFileFormatsNames } from "../../../types/types";
import { encode } from "../../encode";

export const jpegPngWebpToFile = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  compileToOne: boolean
): Promise<Blob | HTMLCanvasElement | void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = blobURL;

    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        if (compileToOne) {
          resolve(canvas)
        } else {
          const encoded = await encode(
            canvas,
            targetFormatSettings,
            activeTargetFormatName
          );
          if (encoded) {
            resolve(encoded);
          }
        }
      } catch (err) {
        reject(err);
      }
    };
    // If image not valid
    img.onerror = () => {
      reject(new Error("Error while parsing image"));
    };
  });
};
