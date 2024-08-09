import { CanvasToBMP } from "./canvasToBMP";

const encodeBMP = async (canvas: HTMLCanvasElement): Promise<Blob> => {
  const canvasConverter = new CanvasToBMP();
  const data = canvasConverter.toBuffer(canvas);

  return new Blob([data], { type: "image/bmp" });
};

export default encodeBMP;
