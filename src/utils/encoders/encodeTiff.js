import UTIF from "utif";

export const encodeTiff = async (canvas) => {
  return new Promise((resolve, reject) => {
    const { width, height } = canvas;
    const ctx = canvas.getContext("2d");

    const { data: pixels } = ctx.getImageData(0, 0, width, height);
    const encoded = UTIF.encodeImage(pixels, width, height);

    resolve(new Blob([encoded], { type: "image/tiff" }));
  });
};
