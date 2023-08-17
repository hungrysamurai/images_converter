import heic2any from "heic2any";

export const heicToFile = async (blobURL, targetFormat) => {
  const file = await fetch(blobURL);
  const blob = await file.blob();

  try {
    const result = await heic2any({
      blob,
      toType: `image/${targetFormat}`,
      quality: 1,
    });

    return result;

  } catch (err) {

    // "different" jpeg-like HEIC case
    if (err.code === 1) {
      return new Promise((resolve, reject) => {
        try {
          const url = window.URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                resolve(blob);
              },
              `image/${targetFormat}`,
              1
            );
          }
        } catch (err) {
          reject(new Error('Failed to process HEIC image file.'));
        }
      })
    } else {
      throw new Error('Failed to process HEIC image file.')
    }
  }
}
