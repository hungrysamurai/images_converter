import { parseGIF, decompressFrames } from "gifuct-js";
import { nanoid } from "@reduxjs/toolkit";

import { MIMETypes, OutputFileFormatsNames } from "../../../types/types";

import { AppDispatch } from "../../../store/store";
import { addConvertedFile } from "../../../store/slices/processFilesSlice/processFilesSlice";

import { encode } from "../../encode";

export const gifToFiles = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  dispatch: AppDispatch
): Promise<void> => {
  const { blobURL, id, name } = source;

  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const gif = parseGIF(arrayBuffer);
  const frames = decompressFrames(gif, true);

  const {
    lsd: { width },
    lsd: { height },
  } = gif;

  for (const [index, frame] of frames.entries()) {
    const { width: frameWidth, height: frameHeight, top, left } = frame.dims;

    const imageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frameWidth,
      frameHeight
    );

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = width;
    canvas.height = height;

    ctx.putImageData(imageData, top, left);

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
          name: `${name}_${index + 1}`,
          size,
          type: `image/${activeTargetFormatName}` as MIMETypes,
          id: nanoid(),
          sourceId: id,
        })
      );
    }
  }
};
