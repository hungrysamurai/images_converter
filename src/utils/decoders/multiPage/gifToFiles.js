import { parseGIF, decompressFrames } from "gifuct-js";

import { nanoid } from "@reduxjs/toolkit";

import { addConvertedFile } from "../../../store/slices/processFilesSlice/processFilesSlice";

export const gifToFiles = async (source, targetFormat, dispatch) => {
 const { blobURL, id, name } = source;

 try {
  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const gif = parseGIF(arrayBuffer);
  const frames = decompressFrames(gif, true);

  const {
   lsd: { width },
   lsd: { height },
  } = gif;

  for (const [index, frame] of frames.entries()) {
   const {
    width: frameWidth,
    height: frameHeight,
    top,
    left
   } = frame.dims;

   const imageData = new ImageData(
    new Uint8ClampedArray(frame.patch),
    frameWidth,
    frameHeight
   );

   const canvas = document.createElement("canvas");
   const ctx = canvas.getContext("2d");

   canvas.width = width;
   canvas.height = height;

   ctx.putImageData(imageData, top, left);
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
  throw new Error("Failed to process GIF image file:", err)
 }
}