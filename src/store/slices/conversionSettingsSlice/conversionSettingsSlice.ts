import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { initialState } from './settings';

import { OUTPUT_FORMATS, type OutputFormat } from '@/types/formats';
import type {
  ConversionSettingsState,
  Dither,
  OutputSettingsMap,
  OutputTarget,
  PDFCompression,
  ResizeUnits,
  Smoothing,
} from './types';

const getActiveSettings = (state: ConversionSettingsState) =>
  state.outputSettings[state.activeFormat];

const resetFormatSettings = <F extends OutputFormat>(
  outputSettings: OutputSettingsMap,
  format: F,
) => {
  outputSettings[format] = initialState.outputSettings[format];
};

const toOutputTarget = <F extends OutputFormat>(
  format: F,
  outputSettings: OutputSettingsMap,
): OutputTarget<F> => ({ format, settings: outputSettings[format] });

export const conversionSettingsSlice = createSlice({
  name: 'conversionSettings',
  initialState,
  reducers: (create) => ({
    resetActiveFormat: create.reducer((state) => {
      resetFormatSettings(state.outputSettings, state.activeFormat);
      state.inputSettings = initialState.inputSettings;
    }),

    switchTargetFormat: create.reducer((state) => {
      const nextFormatIndex =
        (OUTPUT_FORMATS.indexOf(state.activeFormat) + 1) % OUTPUT_FORMATS.length;

      state.activeFormat = OUTPUT_FORMATS[nextFormatIndex];
    }),

    selectTargetFormat: create.reducer((state, action: PayloadAction<OutputFormat>) => {
      state.activeFormat = action.payload;
    }),

    // Resize settings
    setResize: create.reducer((state, action: PayloadAction<boolean>) => {
      getActiveSettings(state).resize = action.payload;
    }),

    setResizeUnits: create.reducer((state, action: PayloadAction<ResizeUnits>) => {
      const settings = getActiveSettings(state);

      settings.units = action.payload;
      settings.targetWidth = null;
      settings.targetHeight = null;
    }),

    setTargetWidth: create.reducer((state, action: PayloadAction<number | null>) => {
      getActiveSettings(state).targetWidth = action.payload;
    }),

    setTargetHeight: create.reducer((state, action: PayloadAction<number | null>) => {
      getActiveSettings(state).targetHeight = action.payload;
    }),

    setSmoothing: create.reducer((state, action: PayloadAction<Smoothing>) => {
      getActiveSettings(state).smoothing = action.payload;
    }),

    // Format specific settings, ignored if active format has no such setting
    setQuality: create.reducer((state, action: PayloadAction<number>) => {
      const settings = getActiveSettings(state);

      if ('quality' in settings) settings.quality = action.payload;
    }),

    setDither: create.reducer((state, action: PayloadAction<Dither>) => {
      const settings = getActiveSettings(state);

      if ('dither' in settings) settings.dither = action.payload;
    }),

    setCompression: create.reducer((state, action: PayloadAction<PDFCompression>) => {
      const settings = getActiveSettings(state);

      if ('compression' in settings) settings.compression = action.payload;
    }),

    setMerge: create.reducer((state, action: PayloadAction<boolean>) => {
      const settings = getActiveSettings(state);

      if ('merge' in settings) settings.merge = action.payload;
    }),

    setAnimationDelay: create.reducer((state, action: PayloadAction<number | null>) => {
      const settings = getActiveSettings(state);

      if ('animationDelay' in settings) settings.animationDelay = action.payload || 200;
    }),

    // Input settings
    setPDFResolution: create.reducer((state, action: PayloadAction<number>) => {
      state.inputSettings.pdf.resolution = action.payload;
    }),

    setPDFRotation: create.reducer((state, action: PayloadAction<number>) => {
      state.inputSettings.pdf.rotation = action.payload;
    }),
  }),

  selectors: {
    getActiveTargetFormatName: (state) => state.activeFormat,
    getActiveOutputTarget: createSelector(
      [
        (state: ConversionSettingsState) => state.activeFormat,
        (state: ConversionSettingsState) => state.outputSettings,
      ],
      toOutputTarget,
    ),
    getInputSettings: (state) => state.inputSettings,
    getPDFInputSettings: (state) => state.inputSettings.pdf,
  },
});

export const {
  resetActiveFormat,
  switchTargetFormat,
  selectTargetFormat,
  setResize,
  setResizeUnits,
  setTargetWidth,
  setTargetHeight,
  setSmoothing,
  setQuality,
  setDither,
  setCompression,
  setMerge,
  setAnimationDelay,
  setPDFResolution,
  setPDFRotation,
} = conversionSettingsSlice.actions;

export const {
  getActiveTargetFormatName,
  getActiveOutputTarget,
  getInputSettings,
  getPDFInputSettings,
} = conversionSettingsSlice.selectors;

export default conversionSettingsSlice.reducer;
