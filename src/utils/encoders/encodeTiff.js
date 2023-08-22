import UTIF from "utif";

export const encodeTiff = async (canvas) => {

  const ctx = canvas.getContext('2d');

  const { width: srcWidth, height: srcHeight } = canvas;
  const imageAspectRatio = srcWidth / srcHeight;

  const canvas2 = document.createElement('canvas');
  const ctx2 = canvas2.getContext('2d');

  const targetWidth = 100; //option
  // const targetHeight = 2000; //option
  const targetHeight = Number((targetWidth / imageAspectRatio).toFixed(0)) //option

  // const targetWidth = Number((targetHeight * imageAspectRatio).toFixed(0));
  // console.log(targetWidth);

  canvas2.width = targetWidth;
  canvas2.height = targetHeight;

  // ctx2.imageSmoothingEnabled = false; //option
  ctx2.imageSmoothingQuality = "high"; // option

  ctx2.drawImage(canvas, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    const { width, height } = canvas2;
    // const ctx = canvas.getContext("2d");

    const { data: pixels } = ctx2.getImageData(0, 0, width, height);
    const encoded = UTIF.encodeImage(pixels, width, height);

    resolve(new Blob([encoded], { type: "image/tiff" }));
  });
};
