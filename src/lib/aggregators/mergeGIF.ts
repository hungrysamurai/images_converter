import GIF from 'gif.js';
import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';
import { isDitherSetting } from '../../types/typeGuards';

const mergeGIF = async (
  collection: MergeCollection,
  targetFormatSettings: OutputConversionSettings,
): Promise<Blob> => {
  if (!isDitherSetting(targetFormatSettings)) {
    throw new Error('Invalid target format settings for GIF');
  }

  const { quality, dither, animationDelay } = targetFormatSettings;

  const options = {
    workers: 2,
    quality,
    workerScript: gifWorkerUrl,
    dither,
    repeat: 0,
  };

  const gif = new GIF(options);

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
