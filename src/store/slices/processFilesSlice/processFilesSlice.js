import {
  createSlice,
  createAsyncThunk,
  current,
} from "@reduxjs/toolkit";

import { processImage } from "../../../utils/converter";
import { zipAndSave } from "../../../utils/zipAndSave";

const initialState = {
  loading: false,
  files: [],
};

export const convertFiles = createAsyncThunk(
  "processFiles/convertFiles",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const { sourceFiles, conversionSettings } = state;

    for (const source of sourceFiles) {
      await processImage(
        source,
        conversionSettings,
        dispatch
      );
    }
  }
);

export const downloadAllFiles = createAsyncThunk(
  "processFiles/downloadAllFiles",
  async (_, { getState }) => {
    const state = getState();
    const { processFiles, conversionSettings } = state;

    await zipAndSave(processFiles.files, conversionSettings);
  }
)

const processFilesSlice = createSlice({
  name: "processFiles",
  initialState,
  reducers: {
    addConvertedFile: (state, action) => {
      state.files.push(action.payload);
    },
    removeConvertedFile: (state, action) => {
      const fileToRemove = current(state).files.find(
        (el) => el.id === action.payload
      );
      URL.revokeObjectURL(fileToRemove.blobURL);

      return {
        ...state,
        files: state.files.filter((el) => el.id !== action.payload),
      };
    },
    removeAllConvertedFiles: (state) => {
      current(state).files.forEach(file => {
        URL.revokeObjectURL(file.blobURL);
      });

      return {
        ...state,
        files: []
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(convertFiles.pending, (state) => {
        console.log('status change - loading');
        state.loading = true;
      })
      .addCase(convertFiles.fulfilled, (state) => {
        console.log('status change - done');
        state.loading = false;
      })
      .addCase(downloadAllFiles.pending, (state) => {
        console.log('status change - loading');
        state.loading = true;
      })
      .addCase(downloadAllFiles.fulfilled, (state) => {
        console.log('status change - done');
        state.loading = false;
      })
  },
});

export const {
  addConvertedFile,
  removeConvertedFile,
  removeAllConvertedFiles
} = processFilesSlice.actions;

export const getAllProcessedFiles = (state) => state.processFiles.files;
export const isProcessingLoading = (state) => state.processFiles.loading;

export default processFilesSlice.reducer;
