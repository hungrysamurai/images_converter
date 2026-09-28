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
        units: 'pixels',
        targetWidth: null,
        targetHeight: null,
        smoothing: 'medium',
        quality: 0.75,
      },
      png: {
        resize: false,
        units: 'pixels',
        targetWidth: null,
        targetHeight: null,
        smoothing: 'medium',
      },
      webp: {
        resize: false,
        units: 'pixels',
        targetWidth: null,
        targetHeight: null,
        smoothing: 'medium',
        quality: 0.75,
      },
      bmp: {
        resize: false,
        units: 'pixels',
        targetWidth: null,
        targetHeight: null,
        smoothing: 'medium',
      },
      gif: {
        resize: false,
        units: 'pixels',
        targetWidth: null,
        targetHeight: null,
        merge: false,
        smoothing: 'medium',
        quality: 11,
        animationDelay: 200,
        dither: false,
      },
      tiff: {
        resize: false,
        units: 'pixels',
        targetWidth: null,
        targetHeight: null,
        smoothing: 'medium',
      },
      pdf: {
        resize: false,
        merge: false,
        quality: 0.75,
        units: 'pixels',
        targetWidth: null,
        targetHeight: null,
        smoothing: 'medium',
        compression: 'jpeg',
      },
    },
  },
};
