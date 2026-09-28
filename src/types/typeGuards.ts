import type {
  BasicOutputConversionSettings,
  GIFOutputConversionSettings,
  JPEG_WEBPOutputConversionSettings,
  PDFOutputConversionSettings,
} from '@/store/slices/conversionSettingsSlice/types';
import type { ProcessedFile, SourceFile } from './files';

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
