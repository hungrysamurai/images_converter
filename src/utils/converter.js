import UTIF from "utif";
import { parseGIF, decompressFrames } from "gifuct-js";
import heic2any from "heic2any";

export const processImage = async (source, settings) => {
  return new Promise((resolve, reject) => {
    const { activeTargetFormat, targetFormats } = settings;
    const { blobURL, type } = source;

    const targetFormat = targetFormats[activeTargetFormat].name;

    switch (type) {
      case "image/tiff": {
        fetch(blobURL)
          .then((r) => r.arrayBuffer())
          .then((arrayBuffer) => {
            const ifds = UTIF.decode(arrayBuffer);
            UTIF.decodeImage(arrayBuffer, ifds[0]);
            const rgba = UTIF.toRGBA8(ifds[0]);

            const imageData = new ImageData(
              new Uint8ClampedArray(rgba.buffer),
              ifds[0].width,
              ifds[0].height
            );
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = ifds[0].width;
            canvas.height = ifds[0].height;

            ctx.putImageData(imageData, 0, 0);
            canvas.toBlob(
              (blob) => {
                resolve(blob);
              },
              `image/${targetFormat}`,
              1
            );


          })
          .catch(() => {
            reject(new Error("Failed to load the image file."));
          });
        break;
      }

      case "image/jpeg":
      case "image/png":
      case "image/webp":
        {
          const img = new Image();
          img.src = blobURL;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
              (blob) => {
                resolve(blob);
              },
              `image/${targetFormat}`,
              1
            );
          };
          img.onerror = function () {
            reject(new Error("Failed to load the image file."));
          };
        }
        break;

      case "image/gif":
        {
          fetch(blobURL)
            .then((r) => r.arrayBuffer())
            .then((arrayBuffer) => {
              const gif = parseGIF(arrayBuffer);
              const {
                lsd: { width },
                lsd: { height },
              } = gif;
              const frames = decompressFrames(gif, true);

              const imageData = new ImageData(
                new Uint8ClampedArray(frames[0].patch),
                width,
                height
              );

              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              canvas.width = width;
              canvas.height = height;

              ctx.putImageData(imageData, 0, 0);
              canvas.toBlob(
                (blob) => {
                  resolve(blob);
                },
                `image/${targetFormat}`,
                1
              );
            })
            .catch(() => {
              reject(new Error("Failed to load the image file."));
            });
        }
        break;

      case 'image/bmp':
        {
          fetch(blobURL)
            .then((r) => r.arrayBuffer())
            .then((arrayBuffer) => {
              const datav = new DataView(arrayBuffer);
              const bitmap = {};

              bitmap.fileheader = {};
              bitmap.fileheader.bfType =
                datav.getUint16(0, true);
              bitmap.fileheader.bfSize =
                datav.getUint32(2, true);
              bitmap.fileheader.bfReserved1 =
                datav.getUint16(6, true);
              bitmap.fileheader.bfReserved2 =
                datav.getUint16(8, true);
              bitmap.fileheader.bfOffBits =
                datav.getUint32(10, true);

              bitmap.infoheader = {};
              bitmap.infoheader.biSize =
                datav.getUint32(14, true);
              bitmap.infoheader.biWidth =
                datav.getUint32(18, true);
              bitmap.infoheader.biHeight =
                datav.getUint32(22, true);
              bitmap.infoheader.biPlanes =
                datav.getUint16(26, true);
              bitmap.infoheader.biBitCount =
                datav.getUint16(28, true);
              bitmap.infoheader.biCompression =
                datav.getUint32(30, true);
              bitmap.infoheader.biSizeImage =
                datav.getUint32(34, true);
              bitmap.infoheader.biXPelsPerMeter =
                datav.getUint32(38, true);
              bitmap.infoheader.biYPelsPerMeter =
                datav.getUint32(42, true);
              bitmap.infoheader.biClrUsed =
                datav.getUint32(46, true);
              bitmap.infoheader.biClrImportant =
                datav.getUint32(50, true);

              const start = bitmap.fileheader.bfOffBits;
              bitmap.stride =
                Math.floor((bitmap.infoheader.biBitCount
                  * bitmap.infoheader.biWidth +
                  31) / 32) * 4;
              bitmap.pixels =
                new Uint8ClampedArray(arrayBuffer, start);
              console.log(bitmap);

              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              canvas.width = bitmap.infoheader.biWidth;
              canvas.height = bitmap.infoheader.biHeight;

              const Width = bitmap.infoheader.biWidth;
              const Height = bitmap.infoheader.biHeight;

              const imageData = ctx.createImageData(
                Width, Height);

              const data = imageData.data;
              const bmpdata = bitmap.pixels;
              const stride = bitmap.stride;

              for (let y = 0; y < Height; ++y) {
                for (let x = 0; x < Width; ++x) {
                  let index1 = (x + Width * (Height - y)) * 4;
                  let index2 = x * 3 + stride * y;
                  data[index1] = bmpdata[index2 + 2];
                  data[index1 + 1] = bmpdata[index2 + 1];
                  data[index1 + 2] = bmpdata[index2];
                  data[index1 + 3] = 255;
                }
              }


              ctx.putImageData(imageData, 0, 0);

              canvas.toBlob(
                (blob) => {
                  resolve(blob);
                },
                `image/${targetFormat}`,
                1
              );
            })
        }
        break;

      case "application/pdf": {
        getPDFJS().then(async (PDFJS) => {
          const loadingTask = PDFJS.getDocument(blobURL);
          const pdf = await loadingTask.promise;

          const page = await pdf.getPage(1);

          const viewport = page.getViewport({ scale: 1, rotation: 0, dontFlip: false });

          const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };

          await page.render(renderContext).promise

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            `image/${targetFormat}`,
            1
          );
        })
      }
        break;

      case 'image/heic': {
        fetch(blobURL)
          .then((r) => r.blob())
          .then(blob => heic2any({
            blob,
            toType: `image/${targetFormat}`,
            quality: 1
          })
          )
          .then(res => {
            resolve(res);
          })
          .catch((e) => {
            // "different" jpeg-like HEIC case
            if (e.code === 1) {
              fetch(blobURL)
                .then((r) => r.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const img = new Image();
                  img.src = url;

                  img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(
                      (blob) => {
                        resolve(blob);
                      },
                      `image/${targetFormat}`,
                      1
                    );
                  };
                })
                .catch(() => {
                  reject(new Error("Failed to load the image file."));
                });
            } else {
              reject(new Error("Failed to load the image file."));
            }
          })
      }
        break;
    }
  });
};


const getPDFJS = async () => {
  const PDFJS = await import('pdfjs-dist/build/pdf');
  PDFJS.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.js';

  return PDFJS;
}
