import { InputFileFormatsNames, MIMETypes } from "../../types/types";

export const getFileFormat = (type: MIMETypes): InputFileFormatsNames => {
  let fileFormatName = type.split("/")[1];

  if (fileFormatName === "svg+xml") {
    fileFormatName = InputFileFormatsNames.SVG;
  }

  return fileFormatName as InputFileFormatsNames;
}

