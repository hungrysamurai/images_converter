import { Units } from '../../types/types';

export const getScaledSVGDimensions = (
  currentHeight: number,
  currentWidth: number,
  units: Units,
  targetWidth: number | null,
  targetHeight: number | null,
): {
  width: string;
  height: string;
} => {
  let width: number;
  let height: number;

  if (units === Units.PIXELS) {
    if (targetWidth && !targetHeight) {
      width = targetWidth;
      height = (currentHeight / currentWidth) * width;
    } else if (!targetWidth && targetHeight) {
      height = targetHeight;
      width = (currentWidth / currentHeight) * height;
    } else if (targetWidth && targetHeight) {
      width = targetWidth;
      height = targetHeight;
    } else {
      width = currentWidth;
      height = currentHeight;
    }
  } else if (units === Units.PERCENTAGES) {
    if (targetWidth && !targetHeight) {
      width = (targetWidth / 100) * currentWidth;
      height = (currentHeight / currentWidth) * width;
    } else if (!targetWidth && targetHeight) {
      height = (targetHeight / 100) * currentHeight;
      width = (currentWidth / currentHeight) * height;
    } else if (targetWidth && targetHeight) {
      width = (targetWidth / 100) * currentWidth;
      height = (targetHeight / 100) * currentHeight;
    } else {
      width = currentWidth;
      height = currentHeight;
    }
  } else {
    // fallback
    width = currentWidth;
    height = currentHeight;
  }

  return {
    width: `${width}px`,
    height: `${height}px`,
  };
};
