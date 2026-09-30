import type { OutputTarget, PDFInputSettings } from '@/store/slices/conversionSettingsSlice/types';
import type { MIMEType } from '@/types/formats';

export interface ConvertTask {
  type: MIMEType;
  blobURL: string;
  target: OutputTarget;
  pdfInputSettings?: PDFInputSettings;
  bitmap?: ImageBitmap;
}

// Ready Blob frames pass through the pipeline untouched
export type Frame = OffscreenCanvas | Blob;

export type Decoder = (task: ConvertTask) => AsyncGenerator<Frame>;

export type WorkerResponse = { ok: true; blobs: Blob[] } | { ok: false; message: string };
