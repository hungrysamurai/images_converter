import type { ResizeUnits, Smoothing } from '@/store/slices/conversionSettingsSlice/types';

export const getResizedCanvas = (
  canvas: OffscreenCanvas,
  smoothing: false | Smoothing,
  units: ResizeUnits,
  targetWidth?: number | null,
  targetHeight?: number | null,
): OffscreenCanvas => {
  if (!targetWidth && !targetHeight) return canvas;

  const srcWidth = canvas.width;
  const srcHeight = canvas.height;
  const srcAspectRatio = srcWidth / srcHeight;

  let resultWidth: number | undefined;
  let resultHeight: number | undefined;

  if (units === 'pixels') {
    if (targetWidth && targetHeight) {
      resultWidth = targetWidth;
      resultHeight = targetHeight;
    } else if (!targetWidth && targetHeight) {
      resultWidth = Math.round(targetHeight * srcAspectRatio);
      resultHeight = targetHeight;
    } else if (targetWidth && !targetHeight) {
      resultWidth = targetWidth;
      resultHeight = Math.round(targetWidth / srcAspectRatio);
    }
  } else if (units === 'percentages') {
    if (targetWidth && targetHeight) {
      resultWidth = Math.round((srcWidth * targetWidth) / 100);
      resultHeight = Math.round((srcHeight * targetHeight) / 100);
    } else if (!targetWidth && targetHeight) {
      resultWidth = Math.round((srcWidth * targetHeight) / 100);
      resultHeight = Math.round((srcHeight * targetHeight) / 100);
    } else if (targetWidth && !targetHeight) {
      resultWidth = Math.round((srcWidth * targetWidth) / 100);
      resultHeight = Math.round((srcHeight * targetWidth) / 100);
    }
  }

  if (resultWidth && resultHeight) {
    const resizedCanvas = new OffscreenCanvas(resultWidth, resultHeight);
    const ctx = resizedCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    if (!smoothing) {
      ctx.imageSmoothingEnabled = false;
    } else {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = smoothing as ImageSmoothingQuality;
    }

    ctx.drawImage(canvas, 0, 0, resultWidth, resultHeight);
    return resizedCanvas;
  }

  return canvas;
};
