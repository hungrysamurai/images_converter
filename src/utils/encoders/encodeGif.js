import GIF from "gif.js.optimized";

export const encodeGif = async (canvas) => {
  const ctx = canvas.getContext('2d');

  const { width: srcWidth, height: srcHeight } = canvas;
  const imageAspectRatio = srcWidth / srcHeight;

  const canvas2 = document.createElement('canvas');
  const ctx2 = canvas2.getContext('2d');

  const targetWidth = 1000; //option
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
    const gif = new GIF({
      workers: 2,
      quality: 20,
      workerScript: "node_modules/gif.js.optimized/dist/gif.worker.js",
      dither: 'FloydSteinberg'
    });
    gif.addFrame(canvas2);

    gif.on("finished", function (blob) {
      resolve(blob);
    });

    gif.render();
  });
};
