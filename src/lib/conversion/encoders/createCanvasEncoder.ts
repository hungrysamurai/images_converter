import { MIME } from '@/types/formats';
import type { BasicOutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

type CanvasEncoderSettings = BasicOutputConversionSettings & { quality?: number };

const createCanvasEncoder =
  (format: 'jpeg' | 'png' | 'webp') =>
  async (canvas: OffscreenCanvas, settings: CanvasEncoderSettings): Promise<Blob> => {
    const type = MIME[format];
    const blob = await canvas.convertToBlob({
      type,
      quality: settings.quality === undefined ? undefined : settings.quality / 100,
    });

    // Browsers silently fall back to PNG for MIME types they can't encode
    if (blob.type !== type) {
      throw new Error(
        `Canvas encoding to ${type} is not supported, got ${blob.type || 'unknown type'}`,
      );
    }

    return blob;
  };

export default createCanvasEncoder;
