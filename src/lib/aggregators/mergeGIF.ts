import GIF from 'gif.js';
import { isDitherSetting } from '../../types/typeGuards';

const mergeGIF = async (
  collection: MergeCollection,
  targetFormatSettings: OutputConversionSettings,
): Promise<Blob | void> => {
  if (isDitherSetting(targetFormatSettings)) {
    return new Promise((resolve) => {
      const { quality, dither, animationDelay } = targetFormatSettings;

      const options = {
        workers: 4,
        quality,
        workerScript: `${import.meta.env.BASE_URL}/assets/workers/gif.worker.js`,
        dither,
        repeat: 0,
      };

      const gif = new GIF(options);

      collection.forEach((item) => {
        if (item instanceof HTMLCanvasElement) {
          gif.addFrame(item, { delay: animationDelay });
        }
      });

      gif.on('finished', function (blob: Blob) {
        resolve(blob);
      });

      gif.render();
    });
  }
};

export default mergeGIF;
