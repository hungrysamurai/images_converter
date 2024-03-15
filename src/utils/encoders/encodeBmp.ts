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
    resultingCanvas = await getResizedCanvas(
      canvas,
      targetWidth,
      targetHeight,
      smoothing,
      units
    );
  }

  return new Promise((resolve, reject) => {
    try {
      canvasToBlob(resultingCanvas, (blob: Blob) => {
        resolve(blob);
      });
    } catch (err) {
      console.log(4);
      reject(err)
    }
  });
};
