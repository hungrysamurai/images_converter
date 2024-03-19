import { canvasToBlob } from "../canvasToBMP";
import { getResizedCanvas } from "../getResizedCanvas";

export const encodeBmp = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings
): Promise<Blob> => {
  let resultingCanvas = canvas;

  const { resize, units, smoothing, targetHeight, targetWidth } =
    targetFormatSettings;

  if (resize) {
    resultingCanvas = getResizedCanvas(
      canvas,
      smoothing,
      units,
      targetWidth,
      targetHeight,
    );
  }

  return new Promise((resolve) => {
    canvasToBlob(resultingCanvas, (blob: Blob) => {
      resolve(blob);
    });
  });
};
