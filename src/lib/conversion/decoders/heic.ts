import type { ConvertTask, Frame } from '../types';

const NO_IMAGES_ERROR = 'No images found in HEIC file';

const decodeWithLibheif = async (arrayBuffer: ArrayBuffer): Promise<OffscreenCanvas> => {
  const libheif = await import('libheif-js/wasm-bundle');
  const decoder = new libheif.HeifDecoder();
  const data = await decoder.decode(arrayBuffer);

  if (data.length === 0) {
    throw new Error(NO_IMAGES_ERROR);
  }

  const srcImage = data[0];
  const srcWidth = srcImage.get_width();
  const srcHeight = srcImage.get_height();

  const canvas = new OffscreenCanvas(srcWidth, srcHeight);
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(srcWidth, srcHeight);

  return new Promise((resolve, reject) => {
    srcImage.display(imageData, (displayData) => {
      if (!displayData) {
        return reject(new Error('HEIF processing error'));
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas);
    });
  });
};

// Some files with HEIC MIME type are not decodable by libheif, but browser handles them
const decodeWithBrowser = async (srcBlob: Blob): Promise<OffscreenCanvas> => {
  const imageBitmap = await createImageBitmap(srcBlob);

  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0);
  imageBitmap.close();

  return canvas;
};

export default async function* decodeHEIC({ blobURL }: ConvertTask): AsyncGenerator<Frame> {
  const response = await fetch(blobURL);
  const srcBlob = await response.blob();
  const arrayBuffer = await srcBlob.arrayBuffer();

  let canvas: OffscreenCanvas;

  try {
    canvas = await decodeWithLibheif(arrayBuffer);
  } catch (err) {
    if (!(err as Error).message.includes(NO_IMAGES_ERROR)) throw err;

    canvas = await decodeWithBrowser(srcBlob);
  }

  yield canvas;
}
