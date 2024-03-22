import UTIF from "utif";

const encodeTIFF = async (
  canvas: HTMLCanvasElement,
): Promise<Blob> => {

  let resultingCanvas = canvas;

  const { width, height } = resultingCanvas;

  const resultingCanvasContext = resultingCanvas.getContext('2d') as CanvasRenderingContext2D;
  const { data: pixels } = resultingCanvasContext.getImageData(0, 0, width, height);

  const encoded = UTIF.encodeImage(new Uint8Array(pixels), width, height);

  return new Blob([encoded], { type: "image/tiff" });
};

export default encodeTIFF;
