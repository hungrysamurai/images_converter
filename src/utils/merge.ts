import { nanoid } from "@reduxjs/toolkit";
import { addConvertedFile } from "../store/slices/processFilesSlice/processFilesSlice";
import { AppDispatch } from "../store/store";
import { MIMETypes, OutputFileFormatsNames } from "../types/types";
import mergePDF from "./aggregators/mergePDF";

const merge = async (
  collection: MergeCollection,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  dispatch: AppDispatch
): Promise<void> => {
  switch (activeTargetFormatName) {
    case OutputFileFormatsNames.PDF: {
      try {
        const merged = await mergePDF(collection, targetFormatSettings);

        if (merged) {
          const blob = new Blob([merged], { type: "application/pdf" });
          const URL = window.URL.createObjectURL(blob);

          dispatch(
            addConvertedFile({
              blobURL: URL,
              downloadLink: URL,
              name: `Merged-${Date.now()}`,
              size: blob.size,
              type: `image/${activeTargetFormatName}` as MIMETypes,
              id: nanoid(),
            })
          );
        }
      } catch (err) {
        throw err;
      }
      break;
    }
    case OutputFileFormatsNames.GIF: {
      try {
      } catch (err) {
        throw err;
      }
    }
  }
};

export default merge;
