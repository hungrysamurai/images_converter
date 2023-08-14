
export const processImage = async (source, settings) => {

  const { activeTargetFormat, targetFormats } = settings;

  const targetFormat = targetFormats[activeTargetFormat].name;

  const convertImage = await new Promise((resolve) => {
    const img = new Image();
    img.src = source.blobURL;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);

      const processedBlobURL = canvas.convertToBlob({ type: `image/${targetFormat}` });

      resolve(processedBlobURL);
    };
  });

  return convertImage;
};
