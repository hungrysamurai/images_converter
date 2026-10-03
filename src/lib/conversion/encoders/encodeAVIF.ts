import encode from '@jsquash/avif/encode';

import { MIME } from '@/types/formats';
import type { JPEG_WEBPOutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

// Browsers can't encode AVIF via canvas, so libavif (aom) runs as WASM.
// jsquash picks its single-threaded build since the page isn't cross-origin isolated
const SPEED = 6;

const encodeAVIF = async (
  canvas: OffscreenCanvas,
  settings: JPEG_WEBPOutputConversionSettings,
): Promise<Blob> => {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('2D context not available on OffscreenCanvas');
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = await encode(imageData, { quality: settings.quality, speed: SPEED });

  return new Blob([buffer], { type: MIME.avif });
};

export default encodeAVIF;
