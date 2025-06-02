import libheif from 'libheif-js/wasm-bundle';
import { OutputFileFormatsNames } from '../../../types/types';
import encodeCanvas from '../../encode';
import { getResizedCanvas } from '../../utils/getResizedCanvas';

export default async function HEICToBlob(
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob> {
  const response = await fetch(blobURL);
  const srcBlob = await response.blob();
  const arrayBuffer = await srcBlob.arrayBuffer();

  const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

  try {
    const decoder = new libheif.HeifDecoder();
    const data = await decoder.decode(arrayBuffer);

    if (data.length === 0) {
      throw new Error('No images found in HEIC file');
    }

    const srcImage = data[0];
    const srcWidth = srcImage.get_width();
    const srcHeight = srcImage.get_height();

    let canvas = new OffscreenCanvas(srcWidth, srcHeight);
    const ctx = canvas.getContext('2d');
    const imageData = ctx!.createImageData(srcWidth, srcHeight);

    return new Promise((resolve, reject) => {
      srcImage.display(imageData, async (displayData) => {
        try {
          if (!displayData) {
            return reject(new Error('HEIF processing error'));
          }

          ctx!.putImageData(imageData, 0, 0);

          if (resize) {
            canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
          }

          const encoded = await encodeCanvas(canvas, targetFormatSettings, activeTargetFormatName);

          resolve(encoded);
        } catch (err) {
          reject(err);
        }
      });
    });
  } catch (err) {
    if ((err as Error).message.includes('No images found in HEIC file')) {
      const imageBitmap = await createImageBitmap(srcBlob);

      let canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imageBitmap, 0, 0);

      if (resize) {
        canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
      }

      const encoded = await encodeCanvas(canvas, targetFormatSettings, activeTargetFormatName);

      return encoded;
    } else {
      throw err;
    }
  }
}
