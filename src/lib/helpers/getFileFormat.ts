import { InputFileFormatsNames, MIMETypes } from "../../types/types";

export const getFileFormat = (type: MIMETypes): InputFileFormatsNames =>
  type.split("/")[1] as InputFileFormatsNames;
