import type { ConvertTask, Frame } from '../types';

// Bitmap is already rasterized in target size by the prepare step
export default async function* decodeSVG({ bitmap }: ConvertTask): AsyncGenerator<Frame> {
  if (!bitmap) throw new Error('Missing bitmap for SVG conversion');

  const { width, height } = bitmap;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  yield canvas;
}
