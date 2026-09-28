import encodeCanvas from '@/lib/encode';
import { getResizedCanvas } from '@/lib/utils/getResizedCanvas';
import type { OutputTarget } from '@/store/slices/conversionSettingsSlice/types';

const decodeJPEG_WEBP_PNG = async (blobURL: string, target: OutputTarget): Promise<Blob> => {
  const { resize, units, smoothing, targetHeight, targetWidth } = target.settings;

  const response = await fetch(blobURL);
  const srcBlob = await response.blob();

  const bitmap = await createImageBitmap(srcBlob);

  let canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  ctx.drawImage(bitmap, 0, 0);

  if (resize) {
    canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
  }

  const encoded = await encodeCanvas(canvas, target);

  return encoded;
};

export default decodeJPEG_WEBP_PNG;
