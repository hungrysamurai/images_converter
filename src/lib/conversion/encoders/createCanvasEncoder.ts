import { MIME } from '@/types/formats';
import type { BasicOutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

type CanvasEncoderSettings = BasicOutputConversionSettings & { quality?: number };

const createCanvasEncoder =
  (format: 'jpeg' | 'png' | 'webp') =>
  async (canvas: OffscreenCanvas, settings: CanvasEncoderSettings): Promise<Blob> => {
    return canvas.convertToBlob({
      type: MIME[format],
      quality: settings.quality === undefined ? undefined : settings.quality / 100,
    });
  };

export default createCanvasEncoder;
