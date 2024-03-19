import { OutputFileFormatsNames } from "../../types/types";
import { getResizedCanvas } from "../getResizedCanvas";
import { isQualitySetting } from "../typeGuards";

export const encodeJpgPngWebp = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames
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

  return new Promise((resolve, reject) => {
    let quality

    if (isQualitySetting(targetFormatSettings)) {
      quality = targetFormatSettings.quality
    }
    resultingCanvas.toBlob(
      (blob: Blob | null) => {
        // blob = null
        if (blob) {
          resolve(blob);
        } else {
          reject()
        }
      },
      `image/${activeTargetFormatName}`,
      quality
    )
  });
};
