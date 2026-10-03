import type { ConvertTask, Frame } from '../types';

export default async function* decodeNative({ blobURL }: ConvertTask): AsyncGenerator<Frame> {
  const response = await fetch(blobURL);
  const srcBlob = await response.blob();

  const bitmap = await createImageBitmap(srcBlob);

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  yield canvas;
}
