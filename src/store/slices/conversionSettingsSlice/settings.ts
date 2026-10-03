import type { ConversionSettingsState, OutputSettingsMap } from './types';

const outputSettings = {
  jpeg: {
    resize: false,
    units: 'pixels',
    targetWidth: null,
    targetHeight: null,
    smoothing: 'medium',
    quality: 75,
    keepMetadata: false,
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
    quality: 75,
  },
  // AVIF q60 looks roughly like JPEG q75-80 at a much smaller size
  avif: {
    resize: false,
    units: 'pixels',
    targetWidth: null,
    targetHeight: null,
    smoothing: 'medium',
    quality: 60,
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
    quality: 10,
    animationDelay: 200,
    dither: 'off',
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
    quality: 75,
    units: 'pixels',
    targetWidth: null,
    targetHeight: null,
    smoothing: 'medium',
    compression: 'jpeg',
  },
} satisfies OutputSettingsMap;

export const initialState: ConversionSettingsState = {
  activeFormat: 'jpeg',
  outputSettings,
  inputSettings: {
    pdf: {
      resolution: 72,
      rotation: 0,
    },
  },
};
