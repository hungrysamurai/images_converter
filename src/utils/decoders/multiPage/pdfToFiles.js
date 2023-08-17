import { getPDFJS } from "../../getPDFJS";

import { nanoid } from "@reduxjs/toolkit";

import { addConvertedFile } from "../../../store/slices/processFilesSlice/processFilesSlice";

export const pdfToFiles = async (source, targetFormat, dispatch) => {
 const { blobURL, id, name } = source;

 try {
  const PDFJS = await getPDFJS();
  const loadingTask = PDFJS.getDocument(blobURL);
  const pdf = await loadingTask.promise;

  const { numPages } = pdf._pdfInfo;

  for (let i = 1; i < numPages + 1; i++) {
   const page = await pdf.getPage(i);

   const viewport = page.getViewport({
    scale: 1,
    rotation: 0,
    dontFlip: false,
   });

   const canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

   canvas.height = viewport.height;
   canvas.width = viewport.width;

   const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
   };

   await page.render(renderContext).promise;

   canvas.toBlob(
    (blob) => {
     const size = blob.size;
     const URL = window.URL.createObjectURL(blob);

     dispatch(
      addConvertedFile({
       blobURL: URL,
       downloadLink: URL,
       name: `${name}_${i + 1}.${targetFormat}`,
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
  throw new Error("Failed to process PDF file:", err)
 }
}