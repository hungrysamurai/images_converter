import { getCanvasToBMP } from "../../../public/canvas-to-bmp";

export const encodeBmp = async (canvas) => {
  return new Promise((resolve, reject) => {
    const CanvasToBMP = getCanvasToBMP();
    CanvasToBMP.toBlob(canvas, (blob) => {
      resolve(blob);
    });
  });
};
