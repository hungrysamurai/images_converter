import UTIF from "utif";
import { getResizedCanvas } from "../getResizedCanvas";

export const encodeTiff = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings
): Promise<Blob> => {

  let resultingCanvas = canvas;
  const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

  if (resize) {
    resultingCanvas = getResizedCanvas(
      canvas,
      smoothing,
      units,
      targetWidth,
      targetHeight,
    );
  }

  const { width, height } = resultingCanvas;

  const resultingCanvasContext = resultingCanvas.getContext('2d') as CanvasRenderingContext2D;
  const { data: pixels } = resultingCanvasContext.getImageData(0, 0, width, height);

  const encoded = UTIF.encodeImage(new Uint8Array(pixels), width, height);

  return new Blob([encoded], { type: "image/tiff" });
};
