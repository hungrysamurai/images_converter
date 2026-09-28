import { INPUT_FORMATS, MIME, type InputFormat, type MIMEType } from '@/types/formats';

export const getFileFormat = (type: MIMEType): InputFormat => {
  const format = INPUT_FORMATS.find((format) => MIME[format] === type);

  if (!format) {
    throw new Error(`Unknown MIME type: ${type}`);
  }

  return format;
};
