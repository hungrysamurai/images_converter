export const testImageProcess = async (blobURL, targetFormat) => {
  const convertImage = await new Promise((resolve) => {
    const img = new Image();
    img.src = blobURL;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.convertToBlob({ type: `image/${targetFormat}` }));
    };
  });

  return convertImage;
};
