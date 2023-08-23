import { encode } from "../../encode";

export const jpegPngWebpToFile = async (
  blobURL,
  srcType,
  targetFormatSettings,
  activeTargetFormatName
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

        const encoded = await encode(
          canvas,
          targetFormatSettings,
          activeTargetFormatName
        );

        resolve(encoded);
      };
    } catch (err) {
      reject(new Error(`Failed to process ${srcType} image file.`));
    }
  });
};
