export const OUTPUT_FORMATS = ['jpeg', 'png', 'webp', 'pdf', 'bmp', 'gif', 'tiff'] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

export const INPUT_FORMATS = [...OUTPUT_FORMATS, 'heic', 'svg'] as const;
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
  heic: 'image/heic',
  svg: 'image/svg+xml',
} as const satisfies Record<InputFormat, string>;

export type MIMEType = (typeof MIME)[InputFormat];
