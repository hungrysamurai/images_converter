import type { OutputFormat } from '@/types/formats';

export const SMOOTHING_OPTIONS = ['low', 'medium', 'high', 'off'] as const;
export type Smoothing = (typeof SMOOTHING_OPTIONS)[number];

export const DITHER_OPTIONS = [
  'FloydSteinberg',
  'FloydSteinberg-serpentine',
  'FalseFloydSteinberg',
  'FalseFloydSteinberg-serpentine',
  'Stucki',
  'Stucki-serpentine',
  'Atkinson',
  'Atkinson-serpentine',
  'off',
] as const;
export type Dither = (typeof DITHER_OPTIONS)[number];

export const PDF_COMPRESSION_OPTIONS = ['jpeg', 'png'] as const;
export type PDFCompression = (typeof PDF_COMPRESSION_OPTIONS)[number];

export const RESIZE_UNITS = ['percentages', 'pixels'] as const;
export type ResizeUnits = (typeof RESIZE_UNITS)[number];

export type BasicOutputConversionSettings = {
  resize: boolean;
  units: ResizeUnits;
  targetWidth: number | null;
  targetHeight: number | null;
  smoothing: Smoothing;
};

export type JPEG_WEBPOutputConversionSettings = BasicOutputConversionSettings & {
  quality: number;
};

export type GIFOutputConversionSettings = JPEG_WEBPOutputConversionSettings & {
  dither: Dither;
  merge: boolean;
  animationDelay: number;
};

export type PDFOutputConversionSettings = BasicOutputConversionSettings & {
  quality: number;
  compression: PDFCompression;
  merge: boolean;
};

export type OutputSettingsMap = {
  jpeg: JPEG_WEBPOutputConversionSettings;
  png: BasicOutputConversionSettings;
  webp: JPEG_WEBPOutputConversionSettings;
  avif: JPEG_WEBPOutputConversionSettings;
  pdf: PDFOutputConversionSettings;
  bmp: BasicOutputConversionSettings;
  gif: GIFOutputConversionSettings;
  tiff: BasicOutputConversionSettings;
};

export type OutputTarget<F extends OutputFormat = OutputFormat> = {
  [K in F]: { format: K; settings: OutputSettingsMap[K] };
}[F];

export type PDFInputSettings = {
  resolution: number;
  rotation: number;
};

export type InputSettings = {
  pdf: PDFInputSettings;
};

export type ConversionSettingsState = {
  activeFormat: OutputFormat;
  outputSettings: OutputSettingsMap;
  inputSettings: InputSettings;
};
