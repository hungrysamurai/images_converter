import { OutputFileFormatsNames } from '../types/types';
import encodeBMP from './encoders/encodeBMP';
import encodeGIF from './encoders/encodeGIF';
import encodeJPEG_PNG_WEBP from './encoders/encodeJPEG_PNG_WEBP';
import encodePDF from './encoders/encodePDF';
import encodeTIFF from './encoders/encodeTIFF';

export default async function encodeCanvas(
  canvas: OffscreenCanvas,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob> {
  switch (activeTargetFormatName) {
    case OutputFileFormatsNames.JPG:
    case OutputFileFormatsNames.WEBP:
    case OutputFileFormatsNames.PNG: {
      return encodeJPEG_PNG_WEBP(canvas, targetFormatSettings, activeTargetFormatName);
    }
    case OutputFileFormatsNames.BMP: {
      return encodeBMP(canvas);
    }

    case OutputFileFormatsNames.TIFF: {
      return encodeTIFF(canvas);
    }

    case OutputFileFormatsNames.PDF: {
      return encodePDF(canvas, targetFormatSettings);
    }

    case OutputFileFormatsNames.GIF: {
      return encodeGIF(canvas, targetFormatSettings);
    }
  }
}
