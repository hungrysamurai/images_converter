import type { MIMEType } from './formats';

export type SourceFile = {
  blobURL: string;
  name: string;
  type: MIMEType;
  size: number;
  id: string;
};

export type ProcessedFile = SourceFile & {
  downloadLink: string;
  sourceId?: string;
};
