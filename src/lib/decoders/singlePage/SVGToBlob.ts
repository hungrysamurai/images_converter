import { OutputFileFormatsNames } from '../../../types/types';
import encodeCanvas from '../../encode';

const SVGToBlob = async (
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  bmp: ImageBitmap,
): Promise<Blob> => {
  const { smoothing } = targetFormatSettings;
  const { width, height } = bmp;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // If active output format don't hold transparecy
  if (
    activeTargetFormatName !== OutputFileFormatsNames.PNG &&
    activeTargetFormatName !== OutputFileFormatsNames.TIFF &&
    activeTargetFormatName !== OutputFileFormatsNames.WEBP
  ) {
    ctx!.fillStyle = 'white';
    ctx!.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Apply smoothing preset
  if (!smoothing) {
    ctx!.imageSmoothingEnabled = false;
  } else {
    ctx!.imageSmoothingQuality = smoothing as ImageSmoothingQuality;
  }

  ctx!.drawImage(bmp, 0, 0, width, height);

  const encoded = await encodeCanvas(canvas, targetFormatSettings, activeTargetFormatName);

  return encoded;
};

export default SVGToBlob;
