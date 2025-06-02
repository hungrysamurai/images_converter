import UTIF from 'utif';

const encodeTIFF = async (canvas: OffscreenCanvas): Promise<Blob> => {
  const { width, height } = canvas;

  const resultingCanvasContext = canvas.getContext('2d');
  const { data: pixels } = resultingCanvasContext!.getImageData(0, 0, width, height);

  const encoded = UTIF.encodeImage(new Uint8Array(pixels), width, height);

  return new Blob([encoded], { type: 'image/tiff' });
};

export default encodeTIFF;
