import { tiffToFiles } from "./tiffToFiles";
import { gifToFiles } from "./gifToFiles";
import { pdfToFiles } from "./pdfToFiles";

export const processMultiPagesFile = async (
  source,
  targetFormatSettings,
  activeTargetFormatName,
  inputSettings,
  dispatch
) => {
  const { type: srcType } = source;

  switch (srcType) {
    case "image/tiff":
      {
        try {
          await tiffToFiles(
            source,
            targetFormatSettings,
            activeTargetFormatName,
            dispatch
          );
        } catch (err) {
          throw new Error("Failed to process image:", err);
        }
      }
      break;

    case "image/gif":
      {
        try {
          await gifToFiles(
            source,
            targetFormatSettings,
            activeTargetFormatName,
            dispatch
          );
        } catch (err) {
          throw new Error("Failed to process image:", err);
        }
      }
      break;

    case "application/pdf": {
      try {
        await pdfToFiles(
          source,
          targetFormatSettings,
          activeTargetFormatName,
          inputSettings,
          dispatch);
      } catch (err) {
        throw new Error("Failed to process image:", err);
      }
    }
  }
};
