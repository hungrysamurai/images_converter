export const getCanvasWithWhiteBackground = (canvas: OffscreenCanvas): OffscreenCanvas => {
  const result = new OffscreenCanvas(canvas.width, canvas.height);
  const ctx = result.getContext('2d') as OffscreenCanvasRenderingContext2D;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, result.width, result.height);
  ctx.drawImage(canvas, 0, 0);

  return result;
};
