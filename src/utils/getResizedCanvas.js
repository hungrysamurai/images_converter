export const getResizedCanvas = async (
  canvas,
  targetWidth,
  targetHeight,
  smoothing,
  units
) => {
  if (!targetWidth && !targetHeight) return canvas;

  const { width: srcWidth, height: srcHeight } = canvas;
  const srcAspectRatio = srcWidth / srcHeight;

  const resultingCanvas = document.createElement("canvas");
  const resultingCanvasContext = resultingCanvas.getContext("2d");

  let resultWidth, resultHeight;

  if (units === 'pixels') {
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
  } else if (units === 'percentages') {
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


  resultingCanvas.width = resultWidth;
  resultingCanvas.height = resultHeight;

  if (!smoothing) {
    resultingCanvasContext.imageSmoothingEnabled = false;
  } else {
    resultingCanvasContext.imageSmoothingQuality = smoothing;
  }

  resultingCanvasContext.drawImage(canvas, 0, 0, resultWidth, resultHeight);

  return resultingCanvas;
};
