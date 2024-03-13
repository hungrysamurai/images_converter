import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { initialState } from "./settings";
import { RootState } from "../../store";

import { GIFDitherOptions, OutputFileFormatsNames, SmoothingPresets } from "../../../types";
import { isUnits, isSmoothingOption, isDitherOption, isCompressionOption } from "../../../utils/typeGuards";

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
    updateActiveFormatSliderSettings: (state, action: PayloadAction<QualityOption>) => {
      const { quality } = action.payload;
      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      if (activeTargetFormatName === OutputFileFormatsNames.JPG || activeTargetFormatName === OutputFileFormatsNames.WEBP || activeTargetFormatName === OutputFileFormatsNames.GIF) {
        state.outputSettings.settings[activeTargetFormatName].quality = quality
      }
    },
    updateActiveFormatSelectSettings: (state, action: PayloadAction<SelectOptions>) => {
      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      const value = Object.values(action.payload)[0]

      if (isUnits(value)) {
        state.outputSettings.settings[activeTargetFormatName].targetHeight =
          null;
        state.outputSettings.settings[activeTargetFormatName].targetWidth =
          null;

        state.outputSettings.settings[activeTargetFormatName].units = value
      }

      if (isSmoothingOption(value)) {
        state.outputSettings.settings[activeTargetFormatName].smoothing = value !== SmoothingPresets.OFF ? value : false
      }

      if (activeTargetFormatName === OutputFileFormatsNames.GIF && isDitherOption(value)) {
        state.outputSettings.settings[activeTargetFormatName].dither = value !== GIFDitherOptions.OFF ? value : false
      }

      if (activeTargetFormatName === OutputFileFormatsNames.PDF && isCompressionOption(value)) {
        state.outputSettings.settings[activeTargetFormatName].compression = value
      }
    },
    updateActiveFormatSettings: (
      state,
      action
    ) => {
      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      if (action.payload?.property === "units") {
        state.outputSettings.settings[activeTargetFormatName].targetHeight =
          null;
        state.outputSettings.settings[activeTargetFormatName].targetWidth =
          null;
      }

      state.outputSettings.settings[activeTargetFormatName][action.payload.property] = action.payload.value;
    },
    updateInputSettings: (state, action) => {
      const { property, value } = action.payload;

      state.inputSettings.pdf[property] = value;
    },
  },
});

export const getActiveTargetFormat = (state: RootState) =>
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
  updateActiveFormatSliderSettings,
  updateActiveFormatSelectSettings,
  updateActiveFormatSettings,
  updateInputSettings,
} = conversionSettingsSlice.actions;

export default conversionSettingsSlice.reducer;
