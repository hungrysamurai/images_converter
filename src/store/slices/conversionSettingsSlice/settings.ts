import {
  FileFormatsNames,
  ResizeUnits,
  SmoothingPresets,
  PDFCompressionTypes,
} from "../../../types";



export const initialState: ConversionSettings = {
  inputSettings: {
    pdf: {
      resolution: 300,
      rotation: 0,
    },
  },
  outputSettings: {
    allFormats: [
      FileFormatsNames.JPG,
      FileFormatsNames.PDF,
      FileFormatsNames.WEBP,
      FileFormatsNames.PDF,
      FileFormatsNames.BMP,
      FileFormatsNames.GIF,
      FileFormatsNames.TIFF,
    ],
    activeTargetFormatName: FileFormatsNames.JPG,
    settings: {
      [FileFormatsNames.JPG]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      [FileFormatsNames.PNG]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 1,
      },
      [FileFormatsNames.WEBP]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      [FileFormatsNames.BMP]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      [FileFormatsNames.GIF]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 11,
        dither: false,
      },
      [FileFormatsNames.TIFF]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      [FileFormatsNames.PDF]: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        compression: PDFCompressionTypes.JPG,
      },
    },
  },
};
