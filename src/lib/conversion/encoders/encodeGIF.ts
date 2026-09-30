import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';

import type { GIFOutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

const encodeGIF = async (
  canvas: OffscreenCanvas,
  settings: GIFOutputConversionSettings,
): Promise<Blob> => {
  const GIF = (await import('gif.js')).default;
  const { quality, dither } = settings;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('2D context not available on OffscreenCanvas');
  }

  const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

  const blob: Blob = await new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 21 - quality,
      dither: dither === 'off' ? false : dither,
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
