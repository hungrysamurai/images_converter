import type { OutputTarget, PDFInputSettings } from '@/store/slices/conversionSettingsSlice/types';
import type { MIMEType } from '@/types/formats';

export interface ConvertTask {
  type: MIMEType;
  blobURL: string;
  target: OutputTarget;
  pdfInputSettings?: PDFInputSettings;
  bitmap?: ImageBitmap;
}

export type ConvertTaskResult = Blob | Blob[];
