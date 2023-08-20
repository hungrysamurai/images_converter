import { encode } from "../../encode";

export const jpegPngWebpToFile = async (
  blobURL,
  type,
  targetFormatSettings
) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = blobURL;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const encoded = await encode(canvas, targetFormatSettings);

        resolve(encoded);
      };
    } catch (err) {
      reject(new Error(`Failed to process ${type} image file.`));
    }
  });
};
