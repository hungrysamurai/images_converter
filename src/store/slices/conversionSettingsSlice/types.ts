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

// Checkbox
export type ResizeOption = {
  resize: boolean;
};

export type MergeOption = {
  merge: boolean;
};

export type CheckboxOptions = ResizeOption | MergeOption;

export type CheckboxOptionsKeys = keyof ResizeOption | keyof MergeOption;

// Slider
export type QualityOption = {
  quality: number;
};

// Select
export type UnitsOption = {
  units: ResizeUnits;
};

export type SmoothingOption = {
  smoothing: Smoothing | false;
};

export type DitherOption = {
  dither: Dither | false;
};

export type CompressionOption = {
  compression: PDFCompression;
};

export type SelectOptions = UnitsOption | SmoothingOption | DitherOption | CompressionOption;

export type SelectOptionsValues = ResizeUnits | Smoothing | Dither | PDFCompression;
export type SelectOptionsKeys =
  keyof UnitsOption | keyof SmoothingOption | keyof DitherOption | keyof CompressionOption;

// Output numeric settings
export type TargetWidthOption = {
  targetWidth: number | null;
};

export type TargetHeightOption = {
  targetHeight: number | null;
};

export type GIFAnimationDelay = {
  animationDelay: number;
};

// Input numeric settings
export type PDFInputSettings = {
  resolution: number;
  rotation: number;
};

export type NumericOptions =
  TargetHeightOption | TargetWidthOption | PDFInputSettings | GIFAnimationDelay;

export type NumericOptionsKeys =
  | keyof TargetHeightOption
  | keyof TargetWidthOption
  | keyof PDFInputSettings
  | keyof GIFAnimationDelay;

// Comp
export type BasicOutputConversionSettings = ResizeOption &
  UnitsOption &
  TargetWidthOption &
  TargetHeightOption &
  SmoothingOption;

export type JPEG_WEBPOutputConversionSettings = BasicOutputConversionSettings & QualityOption;

export type GIFOutputConversionSettings = JPEG_WEBPOutputConversionSettings &
  DitherOption &
  MergeOption &
  GIFAnimationDelay;

export type PDFOutputConversionSettings = BasicOutputConversionSettings &
  CompressionOption &
  MergeOption &
  QualityOption;

export type OutputConversionSettings =
  | BasicOutputConversionSettings
  | JPEG_WEBPOutputConversionSettings
  | GIFOutputConversionSettings
  | PDFOutputConversionSettings;

export type CombinedOutputConversionSettings = BasicOutputConversionSettings &
  JPEG_WEBPOutputConversionSettings &
  GIFOutputConversionSettings &
  PDFOutputConversionSettings;

export interface ConversionSettings {
  inputSettings: {
    pdf: PDFInputSettings;
  };
  outputSettings: {
    allFormats: OutputFormat[];
    activeTargetFormatName: OutputFormat;
    settings: {
      jpeg: JPEG_WEBPOutputConversionSettings;
      webp: JPEG_WEBPOutputConversionSettings;
      png: BasicOutputConversionSettings;
      tiff: BasicOutputConversionSettings;
      gif: GIFOutputConversionSettings;
      bmp: BasicOutputConversionSettings;
      pdf: PDFOutputConversionSettings;
    };
  };
}
