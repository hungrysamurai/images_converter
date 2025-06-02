import GIF from 'gif.js';
import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';

import { isDitherSetting } from '../../types/typeGuards';

const encodeGIF = async (
  canvas: OffscreenCanvas,
  targetFormatSettings: OutputConversionSettings,
): Promise<Blob> => {
  if (!isDitherSetting(targetFormatSettings)) {
    throw new Error('Invalid target format settings for GIF');
  }

  const { quality, dither } = targetFormatSettings;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('2D context not available on OffscreenCanvas');
  }

  const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

  const blob: Blob = await new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality,
      dither,
      workerScript: gifWorkerUrl,
    });

    gif.addFrame(imgData);

    gif.on('finished', (result: Blob) => {
      resolve(result);
    });

    gif.on('error', (err: Error) => reject(err));

    gif.render();
  });

  return blob;
};

export default encodeGIF;
