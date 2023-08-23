import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  inputSettings: {
    pdf: {
      resolution: 300,
      rotation: 0
    }
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
        targetWidth: 2000,
        targetHeight: null,
        smoothing: "medium",
      },
      gif: {
        resize: true,
        targetWidth: null,
        targetHeight: 500,
        smoothing: "medium",
        quality: 20,
        dither: "FloydSteinberg",
      },
      tiff: {
        resize: true,
        targetWidth: 2000,
        targetHeight: null,
        smoothing: "medium",
      },
      pdf: {
        resize: true,
        targetWidth: 1000,
        targetHeight: null,
        smoothing: "medium",
        compression: 'JPG'
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
  },
});

export const getActiveTargetFormat = (state) =>
  state.conversionSettings.outputSettings.activeTargetFormatName;

export const getAllTargetFormats = (state) =>
  state.conversionSettings.outputSettings.allFormats;

export const { switchTargetFormat } = conversionSettingsSlice.actions;

export default conversionSettingsSlice.reducer;
