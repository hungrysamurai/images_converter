import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  inputSettings: {
    pdf: {
      resolution: 300,
      rotation: 0,
    },
  },
  outputSettings: {
    allFormats: ["jpeg", "png", "webp", "pdf", "bmp", "gif", "tiff"],
    activeTargetFormatName: "jpeg",
    settings: {
      jpeg: {
        resize: true,
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 0.75,
      },
      png: {
        resize: true,
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 1,
      },
      webp: {
        resize: true,
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 0.75,
      },
      bmp: {
        resize: true,
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
      },
      gif: {
        resize: true,
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 20,
        dither: "FloydSteinberg",
      },
      tiff: {
        resize: true,
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
      },
      pdf: {
        resize: true,
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        compression: "JPG",
      },
    },
  },
};

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
    selectTargetFormat: (state, action) => {
      console.log(action.payload);
      state.outputSettings.activeTargetFormatName = action.payload;
    },
  },
});

export const getActiveTargetFormat = (state) =>
  state.conversionSettings.outputSettings.activeTargetFormatName;

export const getAllTargetFormats = (state) =>
  state.conversionSettings.outputSettings.allFormats;

export const { switchTargetFormat, selectTargetFormat } =
  conversionSettingsSlice.actions;

export default conversionSettingsSlice.reducer;
