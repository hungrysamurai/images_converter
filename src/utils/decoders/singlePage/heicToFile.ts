import heic2any from "heic2any";

import { OutputFileFormatsNames } from "../../../types/types";

import { encode } from "../../encode";

export const heicToFile = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames
): Promise<Blob | void> => {
  const file = await fetch(blobURL);
  const blob = await file.blob();

  try {
    const result = (await heic2any({
      blob,
      toType: `image/png`,
    })) as Blob;

    return new Promise((resolve, reject) => {
      const url = window.URL.createObjectURL(result);
      const img = new Image();
      img.src = url;

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          const encoded = encode(
            canvas,
            targetFormatSettings,
            activeTargetFormatName
          );

          if (encoded) {
            resolve(encoded);
          }
        } catch (err) {
          reject(err);
        }
      };

      // If image not valid
      img.onerror = () => {
        reject(new Error("Error while parsing HEIC image"));
      };
    });
  } catch (err) {
    // "different" jpeg-like HEIC case
    if ((err as { code: number; message: string }).code === 1) {
      return new Promise((resolve, reject) => {
        const url = window.URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const encoded = encode(
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
          reject(new Error("Error while parsing HEIC image"));
        };
      });
    } else {
      throw err;
    }
  }
};
