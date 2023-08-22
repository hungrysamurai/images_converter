import { getResizedCanvas } from "../getResizedCanvas";

export const encodeJpgPngWebp = async (
  canvas,
  targetFormatSettings,
  activeTargetFormatName
) => {
  let resultingCanvas = canvas;

  const { quality, resize, smoothing, targetHeight, targetWidth } =
    targetFormatSettings;

  if (resize) {
    resultingCanvas = await getResizedCanvas(
      canvas,
      targetWidth,
      targetHeight,
      smoothing
    );
  }

  return new Promise((resolve, reject) => {
    resultingCanvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      `image/${activeTargetFormatName}`,
      quality
    );
  });
};
