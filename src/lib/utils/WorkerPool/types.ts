import type {
  OutputConversionSettings,
  PDFInputSettings,
} from '@/store/slices/conversionSettingsSlice/types';
import type { MIMEType, OutputFormat } from '@/types/formats';

export interface ConvertTask {
  type: MIMEType;
  blobURL: string;
  outputSettings: OutputConversionSettings;
  targetFormatName: OutputFormat;
  inputSettings?: {
    pdf: PDFInputSettings;
  };
  bitmap?: ImageBitmap;
}

export type ConvertTaskResult = Blob | Blob[];
