import { nanoid } from '@reduxjs/toolkit';
import { addConvertedFile } from '../store/slices/processFilesSlice/processFilesSlice';
import { AppDispatch } from '../store/store';
import { MIMETypes, OutputFileFormatsNames } from '../types/types';
import mergeGIF from './aggregators/mergeGIF';
import mergePDF from './aggregators/mergePDF';

const merge = async (
  collection: MergeCollection,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  dispatch: AppDispatch,
): Promise<void> => {
  switch (activeTargetFormatName) {
    case OutputFileFormatsNames.PDF: {
      const merged = await mergePDF(collection, targetFormatSettings);

      if (merged) {
        const URL = window.URL.createObjectURL(merged);
        dispatch(
          addConvertedFile({
            blobURL: URL,
            downloadLink: URL,
            name: `Merged-${Date.now()}`,
            size: merged.size,
            type: `image/${activeTargetFormatName}` as MIMETypes,
            id: nanoid(),
          }),
        );
      }

      break;
    }
    case OutputFileFormatsNames.GIF: {
      const merged = await mergeGIF(collection, targetFormatSettings);

      if (merged) {
        const URL = window.URL.createObjectURL(merged);
        dispatch(
          addConvertedFile({
            blobURL: URL,
            downloadLink: URL,
            name: `Merged-${Date.now()}`,
            size: merged.size,
            type: `image/${activeTargetFormatName}` as MIMETypes,
            id: nanoid(),
          }),
        );
      }
    }
  }
};

export default merge;
