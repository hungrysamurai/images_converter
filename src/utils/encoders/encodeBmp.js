import { getCanvasToBMP } from "../../../public/canvas-to-bmp";
import { getResizedCanvas } from "../getResizedCanvas";

export const encodeBmp = async (canvas, targetFormatSettings) => {
  let resultingCanvas = canvas;

  const { resize, smoothing, targetHeight, targetWidth } = targetFormatSettings;

  if (resize) {
    resultingCanvas = await getResizedCanvas(
      canvas,
      targetWidth,
      targetHeight,
      smoothing
    );
  }

  return new Promise((resolve, reject) => {
    const CanvasToBMP = getCanvasToBMP();
    CanvasToBMP.toBlob(resultingCanvas, (blob) => {
      resolve(blob);
    });
  });
};
