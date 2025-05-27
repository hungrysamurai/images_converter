import { OutputFileFormatsNames } from '../../../types/types';
import { encode } from '../../encode';
import { getResizedCanvas } from '../../getResizedCanvas';

export const JPEG_WEBP_PNG_ToFile = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  mergeToOne: boolean,
): Promise<Blob | HTMLCanvasElement | void> => {
  return new Promise((resolve, reject) => {
    const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

    const img = new Image();
    img.src = blobURL;

    img.onload = async () => {
      try {
        let canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        if (resize) {
          canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
        }

        if (mergeToOne) {
          resolve(canvas);
        } else {
          const encoded = await encode(canvas, targetFormatSettings, activeTargetFormatName);
          if (encoded) {
            resolve(encoded);
          }
        }
      } catch (err) {
        reject(err);
      }
    };
    // If image not valid
    img.onerror = () => {
      reject(new Error('Error while parsing image'));
    };
  });
};

export default JPEG_WEBP_PNG_ToFile;
