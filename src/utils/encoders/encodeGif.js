import GIF from "gif.js.optimized";
import { getResizedCanvas } from "../getResizedCanvas";

export const encodeGif = async (
  canvas,
  targetFormatSettings,
  activeTargetFormatName
) => {

  let resultingCanvas = canvas;
  const { resize, units, smoothing, targetHeight, targetWidth, quality, dither } = targetFormatSettings;

  if (resize) {
    resultingCanvas = await getResizedCanvas(
      canvas,
      targetWidth,
      targetHeight,
      smoothing,
      units
    );
  }

  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality,
      workerScript: "node_modules/gif.js.optimized/dist/gif.worker.js",
      dither
    });

    gif.addFrame(resultingCanvas);

    gif.on("finished", function (blob) {
      resolve(blob);
    });

    gif.render();
  });
};
