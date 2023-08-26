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
        resize: false,
        units: "percentages",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 0.75,
      },
      png: {
        resize: false,
        units: "percentages",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 1,
      },
      webp: {
        resize: false,
        units: "percentages",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 0.75,
      },
      bmp: {
        resize: false,
        units: "percentages",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
      },
      gif: {
        resize: false,
        units: "percentages",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 11,
        dither: "FloydSteinberg",
      },
      tiff: {
        resize: true,
        units: "pixels",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
      },
      pdf: {
        resize: false,
        units: "pixels",
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
      state.outputSettings.activeTargetFormatName = action.payload;
    },
    updateActiveFormatSettings: (state, action) => {
      const { property, value } = action.payload;

      const {
        outputSettings: { activeTargetFormatName },
      } = current(state);

      if (property === "units") {
        state.outputSettings.settings[activeTargetFormatName].targetHeight =
          null;
        state.outputSettings.settings[activeTargetFormatName].targetWidth =
          null;
      }

      state.outputSettings.settings[activeTargetFormatName][property] = value;
    },
    updateInputSettings: (state, action) => {
      const { property, value } = action.payload;

      state.inputSettings.pdf[property] = value;
    },
  },
});

export const getActiveTargetFormat = (state) =>
  state.conversionSettings.outputSettings.activeTargetFormatName;

export const getAllTargetFormats = (state) =>
  state.conversionSettings.outputSettings.allFormats;

export const getActiveFormatOutputSettings = (state) => {
  const activeTargetFormatName =
    state.conversionSettings.outputSettings.activeTargetFormatName;

  return state.conversionSettings.outputSettings.settings[
    activeTargetFormatName
  ];
};

export const getPDFInputSettings = (state) =>
  state.conversionSettings.inputSettings.pdf;

export const {
  switchTargetFormat,
  selectTargetFormat,
  updateActiveFormatSettings,
  updateInputSettings,
} = conversionSettingsSlice.actions;

export default conversionSettingsSlice.reducer;
