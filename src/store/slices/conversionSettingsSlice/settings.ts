import {
  InputFileFormatsNames,
  OutputFileFormatsNames,
  Units,
  SmoothingPresets,
  PDFCompressionTypes,
} from '../../../types/types';

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
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      [InputFileFormatsNames.PNG]: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      [InputFileFormatsNames.WEBP]: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      [InputFileFormatsNames.BMP]: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      [InputFileFormatsNames.GIF]: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        merge: false,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 11,
        animationDelay: 200,
        dither: false,
      },
      [InputFileFormatsNames.TIFF]: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      [InputFileFormatsNames.PDF]: {
        resize: false,
        merge: false,
        quality: 0.75,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        compression: PDFCompressionTypes.JPG,
      },
    },
  },
};
