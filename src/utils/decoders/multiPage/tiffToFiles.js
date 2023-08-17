import UTIF from "utif";

import { nanoid } from "@reduxjs/toolkit";

import { addConvertedFile } from "../../../store/slices/processFilesSlice/processFilesSlice";

export const tiffToFiles = async (source, targetFormat, dispatch) => {

 const { blobURL, id, name } = source;

 try {
  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const pages = UTIF.decode(arrayBuffer);

  for (const [index, page] of pages.entries()) {
   UTIF.decodeImage(arrayBuffer, page);
   const rgba = UTIF.toRGBA8(page);

   const { width, height } = page;

   const imageData = new ImageData(
    new Uint8ClampedArray(rgba.buffer),
    width,
    height
   );

   const canvas = document.createElement("canvas");
   const ctx = canvas.getContext("2d");

   canvas.width = page.width;
   canvas.height = page.height;

   ctx.putImageData(imageData, 0, 0);

   canvas.toBlob(
    (blob) => {
     const size = blob.size;
     const URL = window.URL.createObjectURL(blob);

     dispatch(
      addConvertedFile({
       blobURL: URL,
       downloadLink: URL,
       name: `${name}_${index + 1}.${targetFormat}`,
       size,
       type: `image/${targetFormat}`,
       id: nanoid(),
       sourceId: id,
      })
     );
    },
    `image/${targetFormat}`,
    1
   );
  }
 } catch (err) {
  throw new Error("Failed to process TIFF image file:", err)
 }
}