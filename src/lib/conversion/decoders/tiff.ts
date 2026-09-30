import type { ConvertTask, Frame } from '../types';

export default async function* decodeTIFF({ blobURL }: ConvertTask): AsyncGenerator<Frame> {
  const UTIF = await import('utif');

  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const pages = UTIF.decode(arrayBuffer);

  for (const page of pages) {
    UTIF.decodeImage(arrayBuffer, page);
    const rgba = UTIF.toRGBA8(page);

    const { width, height } = page;

    const imageData = new ImageData(
      new Uint8ClampedArray(rgba.buffer as ArrayBuffer),
      width,
      height,
    );

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx?.putImageData(imageData, 0, 0);

    yield canvas;
  }
}
