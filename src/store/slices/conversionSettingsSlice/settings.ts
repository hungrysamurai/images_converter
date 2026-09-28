import { PDFCompressionTypes, SmoothingPresets, Units } from '@/types/types';
import { OUTPUT_FORMATS } from '@/types/formats';

export const initialState: ConversionSettings = {
  inputSettings: {
    pdf: {
      resolution: 72,
      rotation: 0,
    },
  },
  outputSettings: {
    allFormats: [...OUTPUT_FORMATS],
    activeTargetFormatName: 'jpeg',
    settings: {
      jpeg: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      png: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      webp: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      bmp: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      gif: {
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
      tiff: {
        resize: false,
        units: Units.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      pdf: {
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
