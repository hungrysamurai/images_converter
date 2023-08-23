import UTIF from "utif";
import { getResizedCanvas } from "../getResizedCanvas";

export const encodeTiff = async (
  canvas,
  targetFormatSettings
) => {

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
    const { width, height } = resultingCanvas;
    const resultingCanvasContext = resultingCanvas.getContext('2d');

    const { data: pixels } = resultingCanvasContext.getImageData(0, 0, width, height);

    const encoded = UTIF.encodeImage(pixels, width, height);

    resolve(new Blob([encoded], { type: "image/tiff" }));
  });
};
