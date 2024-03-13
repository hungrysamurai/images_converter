import { GIFDitherOptions, PDFCompressionTypes, ResizeUnits, SmoothingPresets } from "../types";

export function isUnits(
 toCheck: SelectOptionsValues
): toCheck is ResizeUnits {
 return Object.values(ResizeUnits).includes(toCheck as ResizeUnits)
}

export function isSmoothingOption(
 toCheck: SelectOptionsValues
): toCheck is SmoothingPresets {
 return Object.values(SmoothingPresets).includes(toCheck as SmoothingPresets)
}

export function isDitherOption(
 toCheck: SelectOptionsValues
): toCheck is GIFDitherOptions {
 return Object.values(GIFDitherOptions).includes(toCheck as GIFDitherOptions)
}

export function isCompressionOption(
 toCheck: SelectOptionsValues
): toCheck is PDFCompressionTypes {
 return Object.values(PDFCompressionTypes).includes(toCheck as PDFCompressionTypes)
}
