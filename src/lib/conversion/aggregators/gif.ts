import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';
import type { GIFOutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

const mergeGIF = async (
  collection: Blob[],
  settings: GIFOutputConversionSettings,
): Promise<Blob> => {
  const GIF = (await import('gif.js')).default;
  const { quality, dither, animationDelay } = settings;

  const gif = new GIF({
    workers: 2,
    quality: 21 - quality,
    workerScript: gifWorkerUrl,
    dither: dither === 'off' ? false : dither,
    repeat: 0,
  });

  for (const blob of collection) {
    const img = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }

    ctx.drawImage(img, 0, 0);

    gif.addFrame(canvas, { delay: animationDelay });
  }

  return new Promise((resolve, reject) => {
    gif.on('finished', (blob: Blob) => resolve(blob));
    gif.on('error', (err: Error) => reject(err));
    gif.render();
  });
};

export default mergeGIF;
