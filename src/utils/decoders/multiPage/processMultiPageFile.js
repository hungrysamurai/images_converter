import { tiffToFiles } from "./tiffToFiles";
import { gifToFiles } from "./gifToFiles";
import { pdfToFiles } from "./pdfToFiles";

export const processMultiPagesFile = async (
  source,
  targetFormatSettings,
  dispatch
) => {
  const { type } = source;

  switch (type) {
    case "image/tiff":
      {
        try {
          await tiffToFiles(source, targetFormatSettings, dispatch);
        } catch (err) {
          throw new Error("Failed to process image:", err);
        }
      }
      break;

    case "image/gif":
      {
        try {
          await gifToFiles(source, targetFormatSettings, dispatch);
        } catch (err) {
          throw new Error("Failed to process image:", err);
        }
      }
      break;

    case "application/pdf": {
      try {
        await pdfToFiles(source, targetFormatSettings, dispatch);
      } catch (err) {
        throw new Error("Failed to process image:", err);
      }
    }
  }
};
