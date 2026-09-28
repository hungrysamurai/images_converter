import encodeBMP from './encoders/encodeBMP';
import encodeGIF from './encoders/encodeGIF';
import encodeJPEG_PNG_WEBP from './encoders/encodeJPEG_PNG_WEBP';
import encodePDF from './encoders/encodePDF';
import encodeTIFF from './encoders/encodeTIFF';
import type { OutputTarget } from '@/store/slices/conversionSettingsSlice/types';

export default async function encodeCanvas(
  canvas: OffscreenCanvas,
  target: OutputTarget,
): Promise<Blob> {
  switch (target.format) {
    case 'jpeg':
    case 'webp': {
      return encodeJPEG_PNG_WEBP(canvas, target.format, target.settings.quality);
    }

    case 'png': {
      return encodeJPEG_PNG_WEBP(canvas, target.format);
    }

    case 'bmp': {
      return encodeBMP(canvas);
    }

    case 'tiff': {
      return encodeTIFF(canvas);
    }

    case 'pdf': {
      return encodePDF(canvas, target.settings);
    }

    case 'gif': {
      return encodeGIF(canvas, target.settings);
    }
  }
}
