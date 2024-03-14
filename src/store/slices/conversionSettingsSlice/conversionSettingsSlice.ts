import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { initialState } from "./settings";
import { RootState } from "../../store";

import {
  GIFDitherOptions,
  OutputFileFormatsNames,
  SmoothingPresets,
} from "../../../types";
import {
  isUnits,
  isSmoothingOption,
  isDitherOption,
  isCompressionOption,
} from "../../../utils/typeGuards";

export const conversionSettingsSlice = createSlice({
  name: "conversionSettings",
  initialState,
  reducers: {
    switchTargetFormat: (state) => {
      const {
        outputSettings: { allFormats, activeTargetFormatName },
      } = current(state);

      const currentFormatIndex = allFormats.indexOf(activeTargetFormatName);
      let newFormatIndex = currentFormatIndex + 1;

      if (newFormatIndex === allFormats.length) {
        newFormatIndex = 0;
      }

      state.outputSettings.activeTargetFormatName = allFormats[newFormatIndex];
    },
    selectTargetFormat: (
      state,
      action: PayloadAction<OutputFileFormatsNames>
    ) => {
      state.outputSettings.activeTargetFormatName = action.payload;
    },
    updateActiveTargetFormatSliderSetting: (
      state,
      action: PayloadAction<QualityOption>
    ) => {
      const { quality } = action.payload;
      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      if (
        activeTargetFormatName === OutputFileFormatsNames.JPG ||
        activeTargetFormatName === OutputFileFormatsNames.WEBP ||
        activeTargetFormatName === OutputFileFormatsNames.GIF
      ) {
        state.outputSettings.settings[activeTargetFormatName].quality = quality;
      }
    },
    updateActiveTargetFormatSelectSetting: (
      state,
      action: PayloadAction<SelectOptions>
    ) => {
      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      const key = Object.keys(action.payload)[0] as SelectOptionsKeys;
      const value = Object.values(action.payload)[0] as SelectOptionsValues;

      if (isUnits(value) && key === "units") {
        state.outputSettings.settings[activeTargetFormatName].targetHeight =
          null;
        state.outputSettings.settings[activeTargetFormatName].targetWidth =
          null;

        state.outputSettings.settings[activeTargetFormatName].units = value;
      }

      if (isSmoothingOption(value) && key === "smoothing") {
        state.outputSettings.settings[activeTargetFormatName].smoothing =
          value !== SmoothingPresets.OFF ? value : false;
      }

      if (
        activeTargetFormatName === OutputFileFormatsNames.GIF &&
        isDitherOption(value) &&
        key === "dither"
      ) {
        state.outputSettings.settings[activeTargetFormatName].dither =
          value !== GIFDitherOptions.OFF ? value : false;
      }

      if (
        activeTargetFormatName === OutputFileFormatsNames.PDF &&
        isCompressionOption(value) &&
        key === "compression"
      ) {
        state.outputSettings.settings[activeTargetFormatName].compression =
          value;
      }
    },
    updateActiveTargetFormatNumericSetting: (
      state,
      action: PayloadAction<NumericOptions>
    ) => {
      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      const key = Object.keys(action.payload)[0] as NumericOptionsKeys;
      const value = Object.values(action.payload)[0] as number | null;

      if (key === "targetHeight" || key === "targetWidth") {
        state.outputSettings.settings[activeTargetFormatName][key] = value;
      }
    },
    updateActiveTargetFormatToggleSetting: (
      state,
      action: PayloadAction<ResizeOption>
    ) => {
      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      const { resize } = action.payload;
      state.outputSettings.settings[activeTargetFormatName].resize = resize;
    },
    updateInputSettings: (state, action: PayloadAction<NumericOptions>) => {
      const key = Object.keys(action.payload)[0] as NumericOptionsKeys;
      const value = Object.values(action.payload)[0] as number;

      if (key === "resolution" || key === "rotation") {
        state.inputSettings.pdf[key] = value;
      }
    },
  },
});

export const getActiveTargetFormatName = (state: RootState) =>
  state.conversionSettings.outputSettings.activeTargetFormatName;

export const getAllTargetFormats = (state: RootState) =>
  state.conversionSettings.outputSettings.allFormats;

export const getActiveFormatOutputSettings = (state: RootState) => {
  const activeTargetFormatName =
    state.conversionSettings.outputSettings.activeTargetFormatName;

  return state.conversionSettings.outputSettings.settings[
    activeTargetFormatName
  ];
};

export const getPDFInputSettings = (state: RootState) =>
  state.conversionSettings.inputSettings.pdf;

export const {
  switchTargetFormat,
  selectTargetFormat,
  updateActiveTargetFormatSliderSetting,
  updateActiveTargetFormatSelectSetting,
  updateActiveTargetFormatNumericSetting,
  updateActiveTargetFormatToggleSetting,
  updateInputSettings,
} = conversionSettingsSlice.actions;

export default conversionSettingsSlice.reducer;
