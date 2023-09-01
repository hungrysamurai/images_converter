import { getCanvasToBMP } from "../../../public/assets/canvas-to-bmp";
import { getResizedCanvas } from "../getResizedCanvas";

export const encodeBmp = async (canvas, targetFormatSettings) => {
  let resultingCanvas = canvas;
  const { resize, units, smoothing, targetHeight, targetWidth } =
    targetFormatSettings;

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
    const CanvasToBMP = getCanvasToBMP();
    CanvasToBMP.toBlob(resultingCanvas, (blob) => {
      resolve(blob);
    });
  });
};
