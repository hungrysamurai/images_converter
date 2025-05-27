import GIF from 'gif.js';
import { isDitherSetting } from '../typeGuards';

const encodeGIF = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings,
): Promise<Blob | void> => {
  if (isDitherSetting(targetFormatSettings)) {
    const { quality, dither } = targetFormatSettings;

    return new Promise((resolve) => {
      const options = {
        workers: 2,
        quality,
        workerScript: `${import.meta.env.BASE_URL}/assets/workers/gif.worker.js`,
        dither,
      };

      const gif = new GIF(options);

      gif.addFrame(canvas);

      gif.on('finished', function (blob: Blob) {
        resolve(blob);
      });

      gif.render();
    });
  }
};

export default encodeGIF;
