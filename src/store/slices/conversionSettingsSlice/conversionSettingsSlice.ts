import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { initialState } from "./settings";
import { RootState } from "../../store";

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
    updateActiveFormatSettings: (
      state,
      action: PayloadAction<SingleOutputSetting>
    ) => {
      const { property, value } = action.payload;
      console.log(property, value);

      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      if (property === "units") {
        state.outputSettings.settings[activeTargetFormatName].targetHeight =
          null;
        state.outputSettings.settings[activeTargetFormatName].targetWidth =
          null;
      }

      // const target = state.outputSettings.settings[activeTargetFormatName];

      // if(property in target){
      //   target[action.payload.property as keyof  PDFOutputConversionSettings] = action.payload.value
      // }

      state.outputSettings.settings[activeTargetFormatName][property] = value;
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
  updateActiveFormatSettings,
  updateInputSettings,
} = conversionSettingsSlice.actions;

export default conversionSettingsSlice.reducer;
