import { getPDFJS } from "../../helpers/getPDFJS";

import { nanoid } from "@reduxjs/toolkit";

import { addConvertedFile } from "../../../store/slices/processFilesSlice/processFilesSlice";

import { encode } from "../../encode";

export const pdfToFiles = async (
  source,
  targetFormatSettings,
  activeTargetFormatName,
  inputSettings,
  dispatch
) => {
  const { blobURL, id, name } = source;

  const {
    pdf: { resolution, rotation },
  } = inputSettings;

  try {
    const PDFJS = await getPDFJS();
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

      const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

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

      const size = encoded.size;
      const URL = window.URL.createObjectURL(encoded);

      dispatch(
        addConvertedFile({
          blobURL: URL,
          downloadLink: URL,
          name: `${name}_${i + 1}.${activeTargetFormatName}`,
          size,
          type: `image/${activeTargetFormatName}`,
          id: nanoid(),
          sourceId: id,
        })
      );
    }
  } catch (err) {
    throw new Error("Failed to process PDF file:", err);
  }
};
