import { GIFDitherOptions, PDFCompressionTypes, ResizeUnits, SmoothingPresets } from "../types";

export function isUnits(
 toCheck: SelectOptionsValues
): toCheck is ResizeUnits {
 return (toCheck as ResizeUnits) in ResizeUnits;
}

export function isSmoothingOption(
 toCheck: SelectOptionsValues
): toCheck is SmoothingPresets {
 return (toCheck as (SmoothingPresets)) in SmoothingPresets
}

export function isDitherOption(
 toCheck: SelectOptionsValues
): toCheck is GIFDitherOptions {
 return (toCheck as (GIFDitherOptions)) in GIFDitherOptions
}

export function isCompressionOption(
 toCheck: SelectOptionsValues
): toCheck is PDFCompressionTypes {
 return (toCheck as (PDFCompressionTypes)) in PDFCompressionTypes
}