export const OUTPUT_FORMATS = ['jpeg', 'png', 'webp', 'pdf', 'bmp', 'gif', 'tiff'] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

// AVIF is input-only until its encoder lands; then it moves to OUTPUT_FORMATS after webp
export const INPUT_FORMATS = [...OUTPUT_FORMATS, 'avif', 'heic', 'svg'] as const;
export type InputFormat = (typeof INPUT_FORMATS)[number];

export type PreviewFormat = Exclude<InputFormat, 'tiff' | 'heic'>;

export const isPreviewFormat = (format: InputFormat): format is PreviewFormat =>
  format !== 'tiff' && format !== 'heic';

export const MIME = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
  bmp: 'image/bmp',
  gif: 'image/gif',
  tiff: 'image/tiff',
  avif: 'image/avif',
  heic: 'image/heic',
  svg: 'image/svg+xml',
} as const satisfies Record<InputFormat, string>;

export type MIMEType = (typeof MIME)[InputFormat];

// Single source of truth for extension fallback, the file input `accept`
// attribute and the formats line on the upload screen. Must be complete:
// a missing extension becomes invisible in the file picker
export const EXTENSIONS = {
  jpeg: ['jpg', 'jpeg', 'jpe', 'jfif'],
  png: ['png'],
  webp: ['webp'],
  pdf: ['pdf'],
  bmp: ['bmp', 'dib'],
  gif: ['gif'],
  tiff: ['tif', 'tiff'],
  avif: ['avif'],
  heic: ['heic', 'heif'],
  svg: ['svg'],
} as const satisfies Record<InputFormat, readonly string[]>;
