import { bmpToFile } from "./decoders/singlePage/bmpToFile";
import { heicToFile } from "./decoders/singlePage/heicToFile";
import { jpegPngWebpToFile } from './decoders/singlePage/jpegPngWebpToFile';

import { tiffToFiles } from "./decoders/multiPage/tiffToFiles";
import { gifToFiles } from "./decoders/multiPage/gifToFiles";
import { pdfToFiles } from "./decoders/multiPage/pdfToFiles";

import { addConvertedFile } from "../store/slices/processFilesSlice/processFilesSlice";

import { nanoid } from "@reduxjs/toolkit";


export const processImage = async (source, settings, dispatch) => {
  const { activeTargetFormat, targetFormats } = settings;
  const targetFormat = targetFormats[activeTargetFormat]

  switch (source.type) {
    case "image/jpeg":
    case "image/png":
    case "image/webp":
    case "image/bmp":
    case "image/heic": {
      try {
        const processed = await processOnePageFile(source, targetFormat.name);
        const { name, id } = source;

        const size = processed.size;
        const URL = window.URL.createObjectURL(processed);

        dispatch(
          addConvertedFile({
            blobURL: URL,
            downloadLink: URL,
            name: `${name}.${targetFormat.name}`,
            size,
            type: `image/${targetFormat.name}`,
            id: nanoid(),
            sourceId: id,
          })
        );

      } catch (err) {
        console.log(err);
      }
    }
      break;

    case "image/tiff":
    case "image/gif":
    case "application/pdf": {
      try {
        await processMultiPagesFile(source, targetFormat.name, dispatch)
      } catch (err) {
        console.log(err);
      }
    }
      break;
  }
};

export const processMultiPagesFile = async (source, targetFormat, dispatch) => {
  const { type } = source;

  switch (type) {
    case "image/tiff": {
      try {
        await tiffToFiles(source, targetFormat, dispatch);
      } catch (err) {
        throw new Error('Failed to process image:', err);
      }
    }
      break;

    case "image/gif": {
      try {
        await gifToFiles(source, targetFormat, dispatch);
      } catch (err) {
        throw new Error('Failed to process image:', err);
      }
    }
      break;

    case "application/pdf": {
      try {
        await pdfToFiles(source, targetFormat, dispatch);
      } catch (err) {
        throw new Error('Failed to process image:', err);
      }
    }
  }
}


export const processOnePageFile = async (source, targetFormat) => {
  return new Promise((resolve, reject) => {
    const { blobURL, type } = source;

    switch (type) {
      case "image/jpeg":
      case "image/png":
      case "image/webp": {
        jpegPngWebpToFile(blobURL, type, targetFormat)
          .then(blob => {
            resolve(blob);
          }).catch(err => {
            reject(new Error('Failed to process image:', err))
          })
      }
        break;

      case "image/bmp": {
        bmpToFile(blobURL, targetFormat)
          .then(blob => {
            resolve(blob)
          }).catch(err => {
            reject(new Error('Failed to process image:', err))
          })
      }
        break;
      case "image/heic": {
        heicToFile(blobURL, targetFormat)
          .then(blob => {
            resolve(blob);
          }).catch(err => {
            reject(new Error('Failed to process image:', err))
          })
      }
    }
  })
}