import encodeCanvas from '@/lib/encode';
import type { OutputTarget } from '@/store/slices/conversionSettingsSlice/types';

const decodeSVGBitmap = async (target: OutputTarget, bmp: ImageBitmap): Promise<Blob> => {
  const { smoothing } = target.settings;
  const { width, height } = bmp;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // If active output format don't hold transparecy
  if (target.format !== 'png' && target.format !== 'tiff' && target.format !== 'webp') {
    ctx!.fillStyle = 'white';
    ctx!.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Apply smoothing preset
  if (smoothing === 'off') {
    ctx!.imageSmoothingEnabled = false;
  } else {
    ctx!.imageSmoothingQuality = smoothing;
  }

  ctx!.drawImage(bmp, 0, 0, width, height);

  const encoded = await encodeCanvas(canvas, target);

  return encoded;
};

export default decodeSVGBitmap;
