import { canvasToBlob } from "./canvasToBMP";

const encodeBMP = async (
  canvas: HTMLCanvasElement,
): Promise<Blob> => {

  return new Promise((resolve) => {
    canvasToBlob(canvas, (blob: Blob) => {
      resolve(blob);
    });
  });
};


export default encodeBMP;