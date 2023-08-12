import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  targetFormats: [
    { name: "jpeg" },
    { name: "png" },
    { name: "gif" },
    { name: "bmp" },
    { name: "tiff" },
    { name: "webp" },
    { name: "pdf" },
  ],
  activeTargetFormat: 0,
};

export const conversionSettingsSlice = createSlice({
  name: "conversionSettings",
  initialState,
  reducers: {
    switchTargetFormat: (state) => {
      const { targetFormats, activeTargetFormat } = state;
      let newFormatIndex = activeTargetFormat + 1;

      if (newFormatIndex === targetFormats.length) {
        newFormatIndex = 0;
      }

      state.activeTargetFormat = newFormatIndex;
    },
  },
});

export const getActiveTargetFormat = (state) =>
  state.conversionSettings.activeTargetFormat;

export const getAllTargetFormats = (state) =>
  state.conversionSettings.targetFormats;

export const { switchTargetFormat } = conversionSettingsSlice.actions;
export default conversionSettingsSlice.reducer;
