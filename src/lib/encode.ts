import { type OutputFormat } from '@/types/formats';
import encodeBMP from './encoders/encodeBMP';
import encodeGIF from './encoders/encodeGIF';
import encodeJPEG_PNG_WEBP from './encoders/encodeJPEG_PNG_WEBP';
import encodePDF from './encoders/encodePDF';
import encodeTIFF from './encoders/encodeTIFF';
import type { OutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

export default async function encodeCanvas(
  canvas: OffscreenCanvas,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFormat,
): Promise<Blob> {
  switch (activeTargetFormatName) {
    case 'jpeg':
    case 'webp':
    case 'png': {
      return encodeJPEG_PNG_WEBP(canvas, targetFormatSettings, activeTargetFormatName);
    }
    case 'bmp': {
      return encodeBMP(canvas);
    }

    case 'tiff': {
      return encodeTIFF(canvas);
    }

    case 'pdf': {
      return encodePDF(canvas, targetFormatSettings);
    }

    case 'gif': {
      return encodeGIF(canvas, targetFormatSettings);
    }
  }
}
