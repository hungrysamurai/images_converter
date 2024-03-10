import { FileFormatsNames, MIMETypes } from "../../types";

export const getFileFormat = (type: MIMETypes): FileFormatsNames =>
  type.split("/")[1] as FileFormatsNames;
