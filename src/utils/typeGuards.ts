import {
  GIFDitherOptions,
  PDFCompressionTypes,
  ResizeUnits,
  SmoothingPresets,
} from "../types";

// Type checkers for conversion setting store slice

export function isUnits(toCheck: SelectOptionsValues): toCheck is ResizeUnits {
  return Object.values(ResizeUnits).includes(toCheck as ResizeUnits);
}

export function isSmoothingOption(
  toCheck: SelectOptionsValues
): toCheck is SmoothingPresets {
  return Object.values(SmoothingPresets).includes(toCheck as SmoothingPresets);
}

export function isDitherOption(
  toCheck: SelectOptionsValues
): toCheck is GIFDitherOptions {
  return Object.values(GIFDitherOptions).includes(toCheck as GIFDitherOptions);
}

export function isCompressionOption(
  toCheck: SelectOptionsValues
): toCheck is PDFCompressionTypes {
  return Object.values(PDFCompressionTypes).includes(
    toCheck as PDFCompressionTypes
  );
}

// Type checkers for UI

export function isQualitySetting(
  toCheck: BasicOutputConversionSettings | JPEG_WEBPOutputConversionSettings
): toCheck is JPEG_WEBPOutputConversionSettings {
  return (toCheck as JPEG_WEBPOutputConversionSettings).quality !== undefined;
}

export function isDitherSetting(
  toCheck: BasicOutputConversionSettings | GIFOutputConversionSettings
): toCheck is GIFOutputConversionSettings {
  return (toCheck as GIFOutputConversionSettings).dither !== undefined;
}

export function isCompressionSetting(
  toCheck: BasicOutputConversionSettings | PDFOutputConversionSettings
): toCheck is PDFOutputConversionSettings {
  return (toCheck as PDFOutputConversionSettings).compression !== undefined;
}
