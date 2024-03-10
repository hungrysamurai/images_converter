import { SourceFilesFormats } from "../../types";
export const getFileFormat = (type: SourceFilesFormats): string =>
  type.split("/")[1];
