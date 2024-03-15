import { MIMETypes, OutputFileFormatsNames } from "../types";

import { processSinglePageFile } from "./decoders/singlePage/processSinglePageFile";
import { processMultiPagesFile } from "./decoders/multiPage/processMultiPageFile";

import { addConvertedFile } from "../store/slices/processFilesSlice/processFilesSlice";

import { nanoid } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";

const processFile = async (
  source: SourceFile,
  settings: ConversionSettings,
  dispatch: AppDispatch
): Promise<void> => {

  const { inputSettings, outputSettings } = settings;
  const { activeTargetFormatName } = outputSettings;

  const targetFormatSettings = outputSettings.settings[activeTargetFormatName];

  switch (source.type) {
    case MIMETypes.JPG:
    case MIMETypes.PNG:
    case MIMETypes.WEBP:
    case MIMETypes.BMP:
    case MIMETypes.HEIC:
      {
        try {
          const processed = await processSinglePageFile(
            source,
            targetFormatSettings,
            activeTargetFormatName
          );
          const { name, id } = source;
          // throw Error('Error from processFile')
          const size = processed.size;
          const URL = window.URL.createObjectURL(processed);

          dispatch(
            addConvertedFile({
              blobURL: URL,
              downloadLink: URL,
              name: `${name}.${activeTargetFormatName}`,
              size,
              type: `image/${activeTargetFormatName}` as MIMETypes,
              id: nanoid(),
              sourceId: id,
            })
          );
        } catch (err) {
          console.log(1);
          throw err
        }
      }
      break;

    case MIMETypes.TIFF:
    case MIMETypes.GIF:
    case MIMETypes.PDF:
      {
        try {
          await processMultiPagesFile(
            source,
            targetFormatSettings,
            activeTargetFormatName,
            inputSettings,
            dispatch
          );
        } catch (err) {
          console.log(err);
        }
      }
      break;
  }
};

export default processFile;