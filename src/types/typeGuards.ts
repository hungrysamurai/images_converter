import {
  DITHER_OPTIONS,
  type Dither,
  PDF_COMPRESSION_OPTIONS,
  type PDFCompression,
  RESIZE_UNITS,
  type ResizeUnits,
  SMOOTHING_OPTIONS,
  type Smoothing,
} from '@/store/slices/conversionSettingsSlice/types';

// Type checkers for conversion setting store slice

const isOneOf = <T extends string>(options: readonly T[], toCheck: string): toCheck is T =>
  (options as readonly string[]).includes(toCheck);

export function isUnits(toCheck: SelectOptionsValues): toCheck is ResizeUnits {
  return isOneOf(RESIZE_UNITS, toCheck);
}

export function isSmoothingOption(toCheck: SelectOptionsValues): toCheck is Smoothing {
  return isOneOf(SMOOTHING_OPTIONS, toCheck);
}

export function isDitherOption(toCheck: SelectOptionsValues): toCheck is Dither {
  return isOneOf(DITHER_OPTIONS, toCheck);
}

export function isCompressionOption(toCheck: SelectOptionsValues): toCheck is PDFCompression {
  return isOneOf(PDF_COMPRESSION_OPTIONS, toCheck);
}

// Type checkers for Output Conversion settings object

export function isQualitySetting(
  toCheck: BasicOutputConversionSettings | JPEG_WEBPOutputConversionSettings,
): toCheck is JPEG_WEBPOutputConversionSettings {
  return (toCheck as JPEG_WEBPOutputConversionSettings).quality !== undefined;
}

export function isDitherSetting(
  toCheck: BasicOutputConversionSettings | GIFOutputConversionSettings,
): toCheck is GIFOutputConversionSettings {
  return (toCheck as GIFOutputConversionSettings).dither !== undefined;
}

export function isCompressionSetting(
  toCheck: BasicOutputConversionSettings | PDFOutputConversionSettings,
): toCheck is PDFOutputConversionSettings {
  return (toCheck as PDFOutputConversionSettings).compression !== undefined;
}

export function isMergeSetting(
  toCheck: BasicOutputConversionSettings | PDFOutputConversionSettings,
): toCheck is PDFOutputConversionSettings {
  return (toCheck as PDFOutputConversionSettings).merge !== undefined;
}

// Type checker for File

export function isProcessedFile(toCheck: ProcessedFile | SourceFile): toCheck is ProcessedFile {
  return (toCheck as ProcessedFile).downloadLink !== undefined;
}
