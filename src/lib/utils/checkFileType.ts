import { MIME, type MIMEType } from '@/types/formats';

export const checkFileType = (type: string): type is MIMEType => {
  return Object.values<string>(MIME).includes(type);
};
