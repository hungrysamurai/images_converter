import {
  InputFileFormatsNames,
  OutputFileFormatsNames,
  ResizeUnits,
  SmoothingPresets,
  PDFCompressionTypes,
} from "../../../types/types";

export const initialState: ConversionSettings = {
  inputSettings: {
    pdf: {
      resolution: 72,
      rotation: 0,
    },
  },
  outputSettings: {
    allFormats: [
      OutputFileFormatsNames.JPG,
      OutputFileFormatsNames.PNG,
      OutputFileFormatsNames.WEBP,
      OutputFileFormatsNames.PDF,
      OutputFileFormatsNames.BMP,
      OutputFileFormatsNames.GIF,
      OutputFileFormatsNames.TIFF,
    ],
    activeTargetFormatName: OutputFileFormatsNames.JPG,
    settings: {
      [InputFileFormatsNames.JPG]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      [InputFileFormatsNames.PNG]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      [InputFileFormatsNames.WEBP]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      [InputFileFormatsNames.BMP]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      [InputFileFormatsNames.GIF]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 11,
        dither: false,
      },
      [InputFileFormatsNames.TIFF]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      [InputFileFormatsNames.PDF]: {
        resize: false,
        merge: false,
        quality: 0.75,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        compression: PDFCompressionTypes.JPG,
      },
    },
  },
};
