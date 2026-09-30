import { OffscreenCanvasToBMP } from './offscreenCanvasToBMP';

const encodeBMP = async (canvas: OffscreenCanvas): Promise<Blob> => {
  const canvasConverter = new OffscreenCanvasToBMP();
  const data = canvasConverter.toBuffer(canvas);

  return new Blob([data], { type: 'image/bmp' });
};

export default encodeBMP;
