import { MIMETypes } from "../../types";

export const checkFileType = (type: string): boolean => {
  return Object.values<string>(MIMETypes).includes(type);
};
