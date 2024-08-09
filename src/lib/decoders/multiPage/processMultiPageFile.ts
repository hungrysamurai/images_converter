import { MIMETypes, OutputFileFormatsNames } from "../../../types/types";
import { AppDispatch } from "../../../store/store";

import TIFFToFiles from "./TIFFToFiles";
import GIFToFiles from "./GIFToFiles";
import PDFToFiles from './PDFToFiles';

const processMultiPagesFile = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  inputSettings: {
    [OutputFileFormatsNames.PDF]: PDFInputSettings
  },
  dispatch: AppDispatch,
  mergeToOne: boolean,
  collection: MergeCollection
) => {
  const { type: srcType } = source;

  switch (srcType) {
    case MIMETypes.TIFF:
      {
        await TIFFToFiles(
          source,
          targetFormatSettings,
          activeTargetFormatName,
          dispatch,
          mergeToOne,
          collection
        );
      }
      break;
    case MIMETypes.GIF:
      {
        await GIFToFiles(
          source,
          targetFormatSettings,
          activeTargetFormatName,
          dispatch,
          mergeToOne,
          collection
        );
      }
      break;

    case MIMETypes.PDF: {
      await PDFToFiles(
        source,
        targetFormatSettings,
        activeTargetFormatName,
        inputSettings,
        dispatch,
        mergeToOne,
        collection
      );
    }
  }
};

export default processMultiPagesFile;