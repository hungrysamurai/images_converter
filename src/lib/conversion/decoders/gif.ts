import type { ConvertTask, Frame } from '../types';

export default async function* decodeGIF({ blobURL }: ConvertTask): AsyncGenerator<Frame> {
  const { decompressFrames, parseGIF } = await import('gifuct-js');

  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const gif = parseGIF(arrayBuffer);
  const frames = decompressFrames(gif, true);

  const {
    lsd: { width },
    lsd: { height },
  } = gif;

  for (const frame of frames) {
    const { width: frameWidth, height: frameHeight, top, left } = frame.dims;

    const imageData = new ImageData(new Uint8ClampedArray(frame.patch), frameWidth, frameHeight);

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    ctx.putImageData(imageData, left, top);

    yield canvas;
  }
}
