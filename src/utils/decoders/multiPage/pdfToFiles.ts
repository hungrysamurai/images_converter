import { degrees, PDFDocument } from 'pdf-lib';
import * as PDFJS from "pdfjs-dist";

import { MIMETypes, OutputFileFormatsNames } from "../../../types/types";

import { nanoid } from "@reduxjs/toolkit";

import { AppDispatch } from "../../../store/store";
import { addConvertedFile } from "../../../store/slices/processFilesSlice/processFilesSlice";

import { encode } from "../../encode";

export const pdfToFiles = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  inputSettings: { [OutputFileFormatsNames.PDF]: PDFInputSettings },
  dispatch: AppDispatch,
  compileToOne: boolean,
  collection: CompileCollection
) => {
  const { blobURL, id, name } = source;

  const {
    pdf: { resolution, rotation },
  } = inputSettings;

  // Don't rasterize PDF Source, just split it!
  if (activeTargetFormatName === OutputFileFormatsNames.PDF && !targetFormatSettings.resize) {
    const blob = await fetch(blobURL);
    const arrayBuffer = await blob.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    const arrays = await Promise.all(pages.map(async function (_, index) {
      const newDocument = await PDFDocument.create();
      const [copiedPage] = await newDocument.copyPages(pdfDoc, [index]);

      copiedPage.setRotation(degrees(rotation))

      // if (targetFormatSettings.resize) {
      //   const mediaBox = copiedPage.getCropBox()
      //   copiedPage.setHeight(targetFormatSettings.targetHeight)
      //   copiedPage.setWidth(targetFormatSettings.targetWidth)
      // }
      newDocument.addPage(copiedPage);

      return await newDocument.save();
    }));

    arrays.forEach((arr, i) => {
      const blob = new Blob([arr], { type: 'application/pdf' })
      const URL = window.URL.createObjectURL(blob);
      const size = blob.size;

      if (compileToOne) {
        collection.push(blob);
      } else {
        dispatch(
          addConvertedFile({
            blobURL: URL,
            downloadLink: URL,
            name: `${name}_${i}`,
            size,
            type: `image/${activeTargetFormatName}` as MIMETypes,
            id: nanoid(),
            sourceId: id,
          })
        );
      }
    })
  } else {
    PDFJS.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}/assets/workers/pdf.worker.js`;

    const loadingTask = PDFJS.getDocument(blobURL);
    const pdf = await loadingTask.promise;

    const { numPages } = pdf._pdfInfo;

    for (let i = 1; i < numPages + 1; i++) {
      const page = await pdf.getPage(i);
      const scale = resolution / 72;

      const viewport = page.getViewport({
        scale,
        rotation,
        dontFlip: false,
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      if (compileToOne) {
        collection.push(canvas)
      } else {
        const encoded = await encode(
          canvas,
          targetFormatSettings,
          activeTargetFormatName
        );

        if (encoded) {
          const size = encoded.size;
          const URL = window.URL.createObjectURL(encoded);

          dispatch(
            addConvertedFile({
              blobURL: URL,
              downloadLink: URL,
              name: `${name}_${i + 1}`,
              size,
              type: `image/${activeTargetFormatName}` as MIMETypes,
              id: nanoid(),
              sourceId: id,
            })
          );
        }
      }
    }
  }
};
