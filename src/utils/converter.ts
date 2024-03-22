import { MIMETypes, OutputFileFormatsNames } from "../types/types";

import processSinglePageFile from "./decoders/singlePage/processSinglePageFile";
import processMultiPagesFile from "./decoders/multiPage/processMultiPageFile";

import { addConvertedFile } from "../store/slices/processFilesSlice/processFilesSlice";

import { nanoid } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";

const processFile = async (
  source: SourceFile,
  outputSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  inputSettings: {
    [OutputFileFormatsNames.PDF]: PDFInputSettings
  },
  dispatch: AppDispatch,
  mergeToOne: boolean,
  collection: MergeCollection
): Promise<void> => {
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
            outputSettings,
            activeTargetFormatName,
            mergeToOne,
            collection
          );

          if (processed) {
            const { name, id } = source;

            const size = processed.size;
            const URL = window.URL.createObjectURL(processed);

            dispatch(
              addConvertedFile({
                blobURL: URL,
                downloadLink: URL,
                name,
                size,
                type: `image/${activeTargetFormatName}` as MIMETypes,
                id: nanoid(),
                sourceId: id,
              })
            );
          }
        } catch (err) {
          throw err;
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
            outputSettings,
            activeTargetFormatName,
            inputSettings,
            dispatch,
            mergeToOne,
            collection
          );
        } catch (err) {
          throw err;
        }
      }
      break;
  }
};

export default processFile;
