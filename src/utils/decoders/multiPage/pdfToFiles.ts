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
  dispatch: AppDispatch
) => {
  const { blobURL, id, name } = source;

  const {
    pdf: { resolution, rotation },
  } = inputSettings;

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
};
