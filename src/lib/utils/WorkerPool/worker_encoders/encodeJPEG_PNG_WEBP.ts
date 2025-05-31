import { isQualitySetting } from '../../../../types/typeGuards';
import { OutputFileFormatsNames } from '../../../../types/types';

const encodeJPEG_PNG_WEBP = async (
  canvas: OffscreenCanvas,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob> => {
  let quality: number | undefined;

  if (isQualitySetting(targetFormatSettings)) {
    quality = targetFormatSettings.quality;
  }

  return canvas.convertToBlob({
    type: `image/${activeTargetFormatName.toLowerCase()}`,
    quality,
  });
};

export default encodeJPEG_PNG_WEBP;
