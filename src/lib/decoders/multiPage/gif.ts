import { OutputFileFormatsNames } from '../../../types/types';

import encodeCanvas from '../../encode';
import { getResizedCanvas } from '../../utils/getResizedCanvas';

const decodeGIF = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob[]> => {
  const { decompressFrames, parseGIF } = await import('gifuct-js');

  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

  const pagesBlobs: Blob[] = [];

  const gif = parseGIF(arrayBuffer);
  const frames = decompressFrames(gif, true);

  const {
    lsd: { width },
    lsd: { height },
  } = gif;

  for (const frame of frames) {
    const { width: frameWidth, height: frameHeight, top, left } = frame.dims;

    const imageData = new ImageData(new Uint8ClampedArray(frame.patch), frameWidth, frameHeight);

    let canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    ctx.putImageData(imageData, left, top);

    if (resize) {
      canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
    }

    const encoded = await encodeCanvas(canvas, targetFormatSettings, activeTargetFormatName);

    pagesBlobs.push(encoded);
  }

  return pagesBlobs;
};

export default decodeGIF;
