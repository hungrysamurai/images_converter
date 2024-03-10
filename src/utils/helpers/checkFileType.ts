import { SourceFilesFormats } from "../../types";

export const checkFileType = (type: string): boolean => {
  return Object.values<string>(SourceFilesFormats).includes(type);
};
