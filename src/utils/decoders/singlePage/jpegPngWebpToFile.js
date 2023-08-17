export const jpegPngWebpToFile = async (blobURL, type, targetFormat) => {
 return new Promise((resolve, reject) => {
  try {
   const img = new Image();
   img.src = blobURL;

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
   };
  } catch (err) {
   reject(new Error(`Failed to process ${type} image file.`));
  }
 })
}