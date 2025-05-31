import { OutputFileFormatsNames } from '../../../../types/types';
import encodeBMP from './encodeBMP';
import encodeJPEG_PNG_WEBP from './encodeJPEG_PNG_WEBP';

export default async function encodeCanvas(
  canvas: OffscreenCanvas,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
) {
  switch (activeTargetFormatName) {
    case OutputFileFormatsNames.JPG:
    case OutputFileFormatsNames.WEBP:
    case OutputFileFormatsNames.PNG: {
      return encodeJPEG_PNG_WEBP(canvas, targetFormatSettings, activeTargetFormatName);
    }
    case OutputFileFormatsNames.BMP: {
      return encodeBMP(canvas);
    }

    // case OutputFileFormatsNames.TIFF: {
    //   return encodeTIFF(canvas);
    // }

    // case OutputFileFormatsNames.GIF: {
    //   return encodeGIF(canvas, targetFormatSettings);
    // }
    // case OutputFileFormatsNames.PDF: {
    //   return encodePDF(canvas, targetFormatSettings);
    // }
  }
}
