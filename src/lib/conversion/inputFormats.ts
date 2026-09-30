import { MIME, type MIMEType } from '@/types/formats';
import type { Decoder } from './types';

export type InputFormatEntry = {
  loadDecoder: () => Promise<Decoder>;
  // Decoder already yields frames in target size, pipeline must not resize them
  selfResizing?: boolean;
};

// All imports must stay lazy: the registry is part of the worker bundle
const loadJPEG_PNG_WEBPDecoder = () => import('./decoders/jpeg_webp_png').then((m) => m.default);

// TODO: SVG still goes through legacy decoder
export const INPUT_FORMATS_REGISTRY: Partial<Record<MIMEType, InputFormatEntry>> = {
  [MIME.jpeg]: { loadDecoder: loadJPEG_PNG_WEBPDecoder },
  [MIME.png]: { loadDecoder: loadJPEG_PNG_WEBPDecoder },
  [MIME.webp]: { loadDecoder: loadJPEG_PNG_WEBPDecoder },
  [MIME.bmp]: { loadDecoder: () => import('./decoders/bmp').then((m) => m.default) },
  [MIME.heic]: { loadDecoder: () => import('./decoders/heic').then((m) => m.default) },
  [MIME.tiff]: { loadDecoder: () => import('./decoders/tiff').then((m) => m.default) },
  [MIME.gif]: { loadDecoder: () => import('./decoders/gif').then((m) => m.default) },
  [MIME.pdf]: { loadDecoder: () => import('./decoders/pdf').then((m) => m.default) },
};

export const getInputFormatEntry = (type: MIMEType): InputFormatEntry | undefined =>
  INPUT_FORMATS_REGISTRY[type];
