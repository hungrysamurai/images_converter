import { EXTENSIONS, INPUT_FORMATS, MIME, type MIMEType } from '@/types/formats';

import { checkFileType } from './checkFileType';

// file.type can be empty or unknown (e.g. no codec installed on Windows,
// incomplete MIME database on Linux), so fall back to the file extension
export const resolveFileType = (file: File): MIMEType | undefined => {
  if (checkFileType(file.type)) {
    return file.type;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || extension === file.name.toLowerCase()) {
    return undefined;
  }

  const format = INPUT_FORMATS.find((format) =>
    (EXTENSIONS[format] as readonly string[]).includes(extension),
  );

  return format && MIME[format];
};
