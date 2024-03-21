import { MIMETypes, OutputFileFormatsNames } from "../../../types/types";
import { AppDispatch } from "../../../store/store";

import { tiffToFiles } from "./tiffToFiles";
import { gifToFiles } from "./gifToFiles";
import { pdfToFiles } from './pdfToFiles';

export const processMultiPagesFile = async (
  source: SourceFile,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  inputSettings: {
    [OutputFileFormatsNames.PDF]: PDFInputSettings
  },
  dispatch: AppDispatch,
  compileToOne: boolean,
  collection: CompileCollection
) => {
  const { type: srcType } = source;

  switch (srcType) {
    case MIMETypes.TIFF:
      {
        await tiffToFiles(
          source,
          targetFormatSettings,
          activeTargetFormatName,
          dispatch,
          compileToOne,
          collection
        );
      }
      break;
    case MIMETypes.GIF:
      {
        await gifToFiles(
          source,
          targetFormatSettings,
          activeTargetFormatName,
          dispatch,
          compileToOne,
          collection
        );
      }
      break;

    case MIMETypes.PDF: {
      await pdfToFiles(
        source,
        targetFormatSettings,
        activeTargetFormatName,
        inputSettings,
        dispatch,
        compileToOne,
        collection
      );
    }
  }
};
