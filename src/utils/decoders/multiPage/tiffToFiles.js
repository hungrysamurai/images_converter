import UTIF from "utif";

import { nanoid } from "@reduxjs/toolkit";

import { addConvertedFile } from "../../../store/slices/processFilesSlice/processFilesSlice";

import { encode } from "../../encode";

export const tiffToFiles = async (
 source,
 targetFormatSettings,
 activeTargetFormatName,
 dispatch
) => {

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

   const encoded = await encode(canvas, targetFormatSettings,
    activeTargetFormatName);

   const size = encoded.size;
   const URL = window.URL.createObjectURL(encoded);

   dispatch(
    addConvertedFile({
     blobURL: URL,
     downloadLink: URL,
     name: `${name}_${index + 1}.${activeTargetFormatName}`,
     size,
     type: `image/${activeTargetFormatName}`,
     id: nanoid(),
     sourceId: id,
    })
   );
  }
 } catch (err) {
  throw new Error("Failed to process TIFF image file:", err)
 }
}