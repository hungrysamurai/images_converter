import { isQualitySetting } from '@/types/typeGuards';
import { MIME, type OutputFormat } from '@/types/formats';
import type { OutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

const encodeJPEG_PNG_WEBP = async (
  canvas: OffscreenCanvas,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFormat,
): Promise<Blob> => {
  let quality: number | undefined;

  if (isQualitySetting(targetFormatSettings)) {
    quality = targetFormatSettings.quality;
  }

  return canvas.convertToBlob({
    type: MIME[activeTargetFormatName],
    quality,
  });
};

export default encodeJPEG_PNG_WEBP;
