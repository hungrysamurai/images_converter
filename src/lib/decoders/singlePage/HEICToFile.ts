import libheif from "libheif-js/wasm-bundle";

import { OutputFileFormatsNames } from "../../../types/types";

import { encode } from "../../encode";
import { getResizedCanvas } from "../../getResizedCanvas";

const HEICToFile = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  mergeToOne: boolean
): Promise<Blob | HTMLCanvasElement | void> => {
  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const { resize, units, smoothing, targetHeight, targetWidth } =
    targetFormatSettings;

  const decoder = new libheif.HeifDecoder();
  const data = await decoder.decode(arrayBuffer);

  if (data.length === 0) {
    throw new Error("No images found in HEIC file");
  }

  const srcImage = data[0];
  const srcWidth = srcImage.get_width();
  const srcHeight = srcImage.get_height();

  return new Promise((resolve, reject) => {
    let canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const imageData = ctx.createImageData(srcWidth, srcHeight);

    canvas.width = srcWidth;
    canvas.height = srcHeight;

    srcImage.display(imageData, (displayData) => {
      if (!displayData) {
        canvas.remove();
        return reject(new Error("HEIF processing error"));
      }

      ctx.putImageData(imageData, 0, 0);

      if (resize) {
        canvas = getResizedCanvas(
          canvas,
          smoothing,
          units,
          targetWidth,
          targetHeight
        );
      }

      if (mergeToOne) {
        resolve(canvas);
      } else {
        const encoded = encode(
          canvas,
          targetFormatSettings,
          activeTargetFormatName
        );

        if (encoded) {
          resolve(encoded);
        } else {
          return reject(new Error("Encoding failed"));
        }
      }
    });
  });
};

export default HEICToFile;
