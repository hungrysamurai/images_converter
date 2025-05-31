import { OutputFileFormatsNames } from '../../../../types/types';
import encodeCanvas from '../worker_encoders/encodeCanvas';
import { getResizedCanvas } from '../worker_utils/getResizedCanvas';

export const JPEG_WEBP_PNG_ToBlob = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob | void> => {
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

  if (encoded) {
    return encoded;
  }
};

export default JPEG_WEBP_PNG_ToBlob;
