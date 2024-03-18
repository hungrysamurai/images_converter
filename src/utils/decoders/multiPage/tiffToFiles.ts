import UTIF from "utif";

import { MIMETypes, OutputFileFormatsNames } from "../../../types";

import { nanoid } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../store/store";
import { addConvertedFile } from "../../../store/slices/processFilesSlice/processFilesSlice";

import { encode } from "../../encode";

export const tiffToFiles = async (
 source: SourceFile,
 targetFormatSettings: OutputConversionSettings,
 activeTargetFormatName: OutputFileFormatsNames,
 dispatch: AppDispatch
): Promise<void> => {
 const { blobURL, id, name } = source;

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
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

  canvas.width = page.width;
  canvas.height = page.height;

  ctx.putImageData(imageData, 0, 0);

  const encoded = await encode(canvas, targetFormatSettings,
   activeTargetFormatName);

  if (encoded) {
   const size = encoded.size;
   const URL = window.URL.createObjectURL(encoded);

   dispatch(
    addConvertedFile({
     blobURL: URL,
     downloadLink: URL,
     name: `${name}_${index + 1}.${activeTargetFormatName}`,
     size,
     type: `image/${activeTargetFormatName}` as MIMETypes,
     id: nanoid(),
     sourceId: id,
    })
   );
  }
 }
}