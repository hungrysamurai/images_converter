import GIF from "gif.js"

import { getResizedCanvas } from "../getResizedCanvas";
import { isDitherSetting } from "../typeGuards";

export const encodeGif = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings
): Promise<Blob | void> => {
  let resultingCanvas = canvas;

  if (isDitherSetting(targetFormatSettings)) {

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

    return new Promise((resolve) => {
      const options = {
        workers: 2,
        quality,
        workerScript: `${import.meta.env.BASE_URL}/assets/workers/gif.worker.js`,
        dither,
      }

      const gif = new GIF(options);

      gif.addFrame(resultingCanvas);

      gif.on("finished", function (blob: Blob) {
        resolve(blob);
      })

      gif.render();
    });
  }
};
