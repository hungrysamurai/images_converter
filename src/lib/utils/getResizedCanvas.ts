import { SmoothingPresets, Units } from '../../types/types';

export const getResizedCanvas = (
  canvas: HTMLCanvasElement,
  smoothing: false | SmoothingPresets,
  units: Units,
  targetWidth?: number | null,
  targetHeight?: number | null,
) => {
  if (!targetWidth && !targetHeight) return canvas;

  const { width: srcWidth, height: srcHeight } = canvas;
  const srcAspectRatio = srcWidth / srcHeight;

  const resultingCanvas = document.createElement('canvas');
  const resultingCanvasContext = resultingCanvas.getContext('2d') as CanvasRenderingContext2D;

  let resultWidth, resultHeight;

  if (units === Units.PIXELS) {
    if (targetWidth && targetHeight) {
      resultWidth = targetWidth;
      resultHeight = targetHeight;
    } else if (!targetWidth && targetHeight) {
      resultWidth = Number((targetHeight * srcAspectRatio).toFixed(0));
      resultHeight = targetHeight;
    } else if (targetWidth && !targetHeight) {
      resultWidth = targetWidth;
      resultHeight = Number((targetWidth / srcAspectRatio).toFixed(0));
    }
  } else if (units === Units.PERCENTAGES) {
    if (targetWidth && targetHeight) {
      resultWidth = Number(((srcWidth / 100) * targetWidth).toFixed(0));
      resultHeight = Number(((srcHeight / 100) * targetHeight).toFixed(0));
    } else if (!targetWidth && targetHeight) {
      resultWidth = Number(((srcWidth / 100) * targetHeight).toFixed(0));
      resultHeight = Number(((srcHeight / 100) * targetHeight).toFixed(0));
    } else if (targetWidth && !targetHeight) {
      resultWidth = Number(((srcWidth / 100) * targetWidth).toFixed(0));
      resultHeight = Number(((srcHeight / 100) * targetWidth).toFixed(0));
    }
  }

  if (resultWidth && resultHeight) {
    resultingCanvas.width = resultWidth;
    resultingCanvas.height = resultHeight;

    if (!smoothing) {
      resultingCanvasContext.imageSmoothingEnabled = false;
    } else {
      resultingCanvasContext.imageSmoothingQuality = smoothing as ImageSmoothingQuality;
    }

    resultingCanvasContext.drawImage(canvas, 0, 0, resultWidth, resultHeight);

    return resultingCanvas;
  }

  return canvas;
};
