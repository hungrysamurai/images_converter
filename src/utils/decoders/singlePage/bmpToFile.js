import { encode } from "../../encode";

export const bmpToFile = async (blobURL, targetFormatSettings) => {

  const blob = await fetch(blobURL);
  const arrayBuffer = await blob.arrayBuffer();

  const dataView = new DataView(arrayBuffer);
  const bitmap = {};

  bitmap.fileheader = {};
  bitmap.fileheader.bfType = dataView.getUint16(0, true);
  bitmap.fileheader.bfSize = dataView.getUint32(2, true);
  bitmap.fileheader.bfReserved1 = dataView.getUint16(6, true);
  bitmap.fileheader.bfReserved2 = dataView.getUint16(8, true);
  bitmap.fileheader.bfOffBits = dataView.getUint32(10, true);

  bitmap.infoheader = {};
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
    Math.floor(
      (bitmap.infoheader.biBitCount * bitmap.infoheader.biWidth + 31) / 32
    ) * 4;
  bitmap.pixels = new Uint8ClampedArray(arrayBuffer, start);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = bitmap.infoheader.biWidth;
  const height = bitmap.infoheader.biHeight;

  canvas.width = width;
  canvas.height = height;

  const imageData = ctx.createImageData(width, height);

  const data = imageData.data;
  const bmpdata = bitmap.pixels;
  const stride = bitmap.stride;

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      let index1 = (x + width * (height - y)) * 4;
      let index2 = x * 3 + stride * y;
      data[index1] = bmpdata[index2 + 2];
      data[index1 + 1] = bmpdata[index2 + 1];
      data[index1 + 2] = bmpdata[index2];
      data[index1 + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    try {

      resolve(encode(canvas, targetFormatSettings));
      // canvas.toBlob(
      //   (blob) => {
      //     resolve(blob);
      //   },
      //   `image/${formatName}`,
      //   1
      // );
    } catch (err) {
      reject(new Error(`Failed to process BMP image file.`));
    }
  })
};
