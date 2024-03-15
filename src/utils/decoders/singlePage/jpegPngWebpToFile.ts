import { MIMETypes, OutputFileFormatsNames } from "../../../types";
import { encode } from "../../encode";

export const jpegPngWebpToFile = async (
  blobURL: string,
  srcType: MIMETypes.JPG | MIMETypes.PNG | MIMETypes.WEBP,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = blobURL;

      img.onload = async () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
          // throw Error('error from img.onload')
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          const encoded = await encode(
            canvas,
            targetFormatSettings,
            activeTargetFormatName
          );

          if (encoded) {
            resolve(encoded);
          }
        } catch (err) {
          console.log(3);
          reject(err);
        }
      };
      // If image not valid
      img.onerror = () => {
        console.log(3);
        reject('Error while parsing image');
      }

    } catch (err) {
      console.log(3);
      reject(err);
    }
  });
};
