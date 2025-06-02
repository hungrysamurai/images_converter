import { OutputFileFormatsNames } from '../../../types/types';
import encodeCanvas from '../../encode';
import { getResizedCanvas } from '../../utils/getResizedCanvas';

const JPEG_WEBP_PNG_ToBlob = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob> => {
  const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

  const response = await fetch(blobURL);
  const srcBlob = await response.blob();

  const bitmap = await createImageBitmap(srcBlob);

  let canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  ctx.drawImage(bitmap, 0, 0);

  if (resize) {
    canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
  }

  const encoded = await encodeCanvas(canvas, targetFormatSettings, activeTargetFormatName);

  return encoded;
};

export default JPEG_WEBP_PNG_ToBlob;
