import GIF from "gif.js.optimized";
import { getResizedCanvas } from "../getResizedCanvas";

export const encodeGif = async (canvas, targetFormatSettings) => {
  let resultingCanvas = canvas;
  const {
    resize,
    units,
    smoothing,
    targetHeight,
    targetWidth,
    quality,
    dither,
  } = targetFormatSettings;

  if (resize) {
    resultingCanvas = await getResizedCanvas(
      canvas,
      targetWidth,
      targetHeight,
      smoothing,
      units
    );
  }
  console.log(quality);
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality,
      workerScript: "/assets/gif.worker.js",
      dither,
    });

    gif.addFrame(resultingCanvas);

    gif.on("finished", function (blob) {
      resolve(blob);
    });

    gif.render();
  });
};
