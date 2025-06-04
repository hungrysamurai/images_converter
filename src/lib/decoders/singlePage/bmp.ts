import { OutputFileFormatsNames } from '../../../types/types';
import encodeCanvas from '../../encode';
import { getResizedCanvas } from '../../utils/getResizedCanvas';

interface Bitmap {
  stride: number;
  pixels: Uint8ClampedArray | undefined;
  fileheader: {
    bfReserved1: number;
    bfReserved2: number;
    bfOffBits: number;
    bfType: number;
    bfSize: number;
  };
  infoheader: {
    biBitCount: number;
    biCompression: number;
    biSizeImage: number;
    biXPelsPerMeter: number;
    biYPelsPerMeter: number;
    biClrUsed: number;
    biClrImportant: number;
    biPlanes: number;
    biHeight: number;
    biWidth: number;
    biSize: number;
  };
}

const decodeBMP = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob> => {
  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

  const dataView = new DataView(arrayBuffer);
  const bitmap: Bitmap = {
    fileheader: {
      bfType: 0,
      bfSize: 0,
      bfReserved1: 0,
      bfReserved2: 0,
      bfOffBits: 0,
    },
    infoheader: {
      biWidth: 0,
      biSize: 0,
      biHeight: 0,
      biBitCount: 0,
      biCompression: 0,
      biSizeImage: 0,
      biXPelsPerMeter: 0,
      biYPelsPerMeter: 0,
      biClrUsed: 0,
      biClrImportant: 0,
      biPlanes: 0,
    },
    stride: 0,
    pixels: undefined,
  };

  bitmap.fileheader.bfType = dataView.getUint16(0, true);
  bitmap.fileheader.bfSize = dataView.getUint32(2, true);
  bitmap.fileheader.bfReserved1 = dataView.getUint16(6, true);
  bitmap.fileheader.bfReserved2 = dataView.getUint16(8, true);
  bitmap.fileheader.bfOffBits = dataView.getUint32(10, true);

  bitmap.infoheader.biSize = dataView.getUint32(14, true);
  bitmap.infoheader.biWidth = dataView.getUint32(18, true);
  bitmap.infoheader.biHeight = dataView.getUint32(22, true);
  bitmap.infoheader.biPlanes = dataView.getUint16(26, true);
  bitmap.infoheader.biBitCount = dataView.getUint16(28, true);
  bitmap.infoheader.biCompression = dataView.getUint32(30, true);
  bitmap.infoheader.biSizeImage = dataView.getUint32(34, true);
  bitmap.infoheader.biXPelsPerMeter = dataView.getUint32(38, true);
  bitmap.infoheader.biYPelsPerMeter = dataView.getUint32(42, true);
  bitmap.infoheader.biClrUsed = dataView.getUint32(46, true);
  bitmap.infoheader.biClrImportant = dataView.getUint32(50, true);

  const start = bitmap.fileheader.bfOffBits;
  bitmap.stride =
    Math.floor((bitmap.infoheader.biBitCount * bitmap.infoheader.biWidth + 31) / 32) * 4;
  bitmap.pixels = new Uint8ClampedArray(arrayBuffer, start);

  const width = bitmap.infoheader.biWidth;
  const height = bitmap.infoheader.biHeight;

  let canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const bmpdata = bitmap.pixels;
  const stride = bitmap.stride;

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const index1 = (x + width * (height - y - 1)) * 4;
      const index2 = x * 3 + stride * y;
      data[index1] = bmpdata![index2 + 2]; // R
      data[index1 + 1] = bmpdata![index2 + 1]; // G
      data[index1 + 2] = bmpdata![index2]; // B
      data[index1 + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (resize) {
    canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
  }

  const encoded = await encodeCanvas(canvas, targetFormatSettings, activeTargetFormatName);

  return encoded;
};

export default decodeBMP;
