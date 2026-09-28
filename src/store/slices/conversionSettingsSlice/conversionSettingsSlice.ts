import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initialState } from './settings';

import {
  isCompressionOption,
  isDitherOption,
  isSmoothingOption,
  isUnits,
} from '@/types/typeGuards';
import { OUTPUT_FORMATS, type OutputFormat } from '@/types/formats';
import type {
  CheckboxOptions,
  CheckboxOptionsKeys,
  CombinedOutputConversionSettings,
  NumericOptions,
  NumericOptionsKeys,
  QualityOption,
  SelectOptions,
  SelectOptionsKeys,
  SelectOptionsValues,
} from './types';

export const conversionSettingsSlice = createSlice({
  name: 'conversionSettings',
  initialState,
  reducers: (create) => ({
    defaultActiveTargetFormat: create.reducer((state) => {
      const { activeFormat } = state;

      // Type not very safe, but whatever
      state.outputSettings[activeFormat] = initialState.outputSettings[
        activeFormat
      ] as CombinedOutputConversionSettings;
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

    updateActiveTargetFormatSliderSetting: create.reducer(
      (state, action: PayloadAction<QualityOption>) => {
        const { quality } = action.payload;
        const { activeFormat } = state;

        if (
          activeFormat === 'jpeg' ||
          activeFormat === 'webp' ||
          activeFormat === 'gif' ||
          activeFormat === 'pdf'
        ) {
          state.outputSettings[activeFormat].quality = quality;
        }
      },
    ),

    updateActiveTargetFormatSelectSetting: create.reducer(
      (state, action: PayloadAction<SelectOptions>) => {
        const { activeFormat } = state;

        const key = Object.keys(action.payload)[0] as SelectOptionsKeys;
        const value = Object.values(action.payload)[0] as SelectOptionsValues;

        if (isUnits(value) && key === 'units') {
          state.outputSettings[activeFormat].targetHeight = null;
          state.outputSettings[activeFormat].targetWidth = null;

          state.outputSettings[activeFormat].units = value;
        }

        if (isSmoothingOption(value) && key === 'smoothing') {
          state.outputSettings[activeFormat].smoothing = value;
        }

        if (activeFormat === 'gif' && isDitherOption(value) && key === 'dither') {
          state.outputSettings[activeFormat].dither = value;
        }

        if (activeFormat === 'pdf' && isCompressionOption(value) && key === 'compression') {
          state.outputSettings[activeFormat].compression = value;
        }
      },
    ),

    updateActiveTargetFormatNumericSetting: create.reducer(
      (state, action: PayloadAction<NumericOptions>) => {
        const { activeFormat } = state;

        const key = Object.keys(action.payload)[0] as NumericOptionsKeys;
        const value = Object.values(action.payload)[0] as number | null;

        if (key === 'animationDelay' && activeFormat === 'gif') {
          state.outputSettings[activeFormat].animationDelay = value || 200;
        }

        if (key === 'targetHeight' || key === 'targetWidth') {
          state.outputSettings[activeFormat][key] = value;
        }
      },
    ),

    updateActiveTargetFormatToggleSetting: create.reducer(
      (state, action: PayloadAction<CheckboxOptions>) => {
        const { activeFormat } = state;

        const key = Object.keys(action.payload)[0] as CheckboxOptionsKeys;
        const value = Object.values(action.payload)[0] as boolean;

        if (key === 'merge' && (activeFormat === 'pdf' || activeFormat === 'gif')) {
          state.outputSettings[activeFormat].merge = value;
        }

        if (key === 'resize') {
          state.outputSettings[activeFormat].resize = value;
        }
      },
    ),

    updateInputSettings: create.reducer((state, action: PayloadAction<NumericOptions>) => {
      const key = Object.keys(action.payload)[0] as NumericOptionsKeys;
      const value = Object.values(action.payload)[0] as number;

      if (key === 'resolution' || key === 'rotation') {
        state.inputSettings.pdf[key] = value;
      }
    }),
  }),

  selectors: {
    getActiveTargetFormatName: (state) => state.activeFormat,
    getActiveFormatOutputSettings: (state) => state.outputSettings[state.activeFormat],
    getPDFInputSettings: (state) => state.inputSettings.pdf,
  },
});

export const {
  switchTargetFormat,
  selectTargetFormat,
  updateActiveTargetFormatSliderSetting,
  updateActiveTargetFormatSelectSetting,
  updateActiveTargetFormatNumericSetting,
  updateActiveTargetFormatToggleSetting,
  updateInputSettings,
  defaultActiveTargetFormat,
} = conversionSettingsSlice.actions;

export const { getActiveTargetFormatName, getActiveFormatOutputSettings, getPDFInputSettings } =
  conversionSettingsSlice.selectors;

export default conversionSettingsSlice.reducer;
