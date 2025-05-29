import { isQualitySetting } from '../../types/typeGuards';
import { OutputFileFormatsNames } from '../../types/types';

const encodeJPEG_PNG_WEBP = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob> => {
  const resultingCanvas = canvas;

  return new Promise((resolve, reject) => {
    let quality;

    if (isQualitySetting(targetFormatSettings)) {
      quality = targetFormatSettings.quality;
    }
    resultingCanvas.toBlob(
      (blob: Blob | null) => {
        // blob = null
        if (blob) {
          resolve(blob);
        } else {
          reject();
        }
      },
      `image/${activeTargetFormatName}`,
      quality,
    );
  });
};

export default encodeJPEG_PNG_WEBP;
