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
