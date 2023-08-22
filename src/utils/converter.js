import { processSinglePageFile } from "./decoders/singlePage/processSinglePageFile";
import { processMultiPagesFile } from "./decoders/multiPage/processMultiPageFile";

import { addConvertedFile } from "../store/slices/processFilesSlice/processFilesSlice";

import { nanoid } from "@reduxjs/toolkit";

export const processFile = async (source, settings, dispatch) => {
  const { inputSettings, outputSettings } = settings;
  const { activeTargetFormatName } = outputSettings;

  const targetFormatSettings = outputSettings.settings[activeTargetFormatName];

  switch (source.type) {
    case "image/jpeg":
    case "image/png":
    case "image/webp":
    case "image/bmp":
    case "image/heic":
      {
        try {
          const processed = await processSinglePageFile(
            source,
            targetFormatSettings,
            activeTargetFormatName,
            inputSettings
          );
          const { name, id } = source;

          const size = processed.size;
          const URL = window.URL.createObjectURL(processed);

          dispatch(
            addConvertedFile({
              blobURL: URL,
              downloadLink: URL,
              name: `${name}.${activeTargetFormatName}`,
              size,
              type: `image/${activeTargetFormatName}`,
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
    case "application/pdf":
      {
        try {
          await processMultiPagesFile(source, targetFormatSettings, dispatch);
        } catch (err) {
          console.log(err);
        }
      }
      break;
  }
};
