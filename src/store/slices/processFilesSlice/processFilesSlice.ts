import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

import { processFile } from "../../../utils/converter";
import { zipAndSave } from "../../../utils/zipAndSave";
import { RootState } from "../../store";

const initialState: ProcessFilesState = {
  loading: false,
  files: [],
};

export const convertFiles = createAsyncThunk(
  "processFiles/convertFiles",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { sourceFiles, conversionSettings } = state;

    for (const source of sourceFiles) {
      await processFile(source, conversionSettings, dispatch);
    }
  }
);

export const downloadAllFiles = createAsyncThunk(
  "processFiles/downloadAllFiles",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const {
      processFiles: { files },
      conversionSettings: {
        outputSettings: { activeTargetFormatName },
      },
    } = state;
    await zipAndSave(files, activeTargetFormatName);
  }
);

const processFilesSlice = createSlice({
  name: "processFiles",
  initialState,
  reducers: {
    addConvertedFile: (state, action) => {
      // Check for name collisions
      const nameCollisionsCount = current(state).files.filter((file) => {
        const inStateFileName = file.name.split(".").toSpliced(-1).join("");
        const processedFileName = action.payload.name
          .split(".")
          .toSpliced(-1)
          .join("");

        return (
          inStateFileName.startsWith(processedFileName) &&
          file.type === action.payload.type
        );
      }).length;

      if (nameCollisionsCount > 0) {
        const format = action.payload.name.split(".").slice(-1).join("");
        const newName =
          action.payload.name.split(".").toSpliced(-1).join("") +
          `_${nameCollisionsCount}`;

        action.payload.name = `${newName}.${format}`;
      }

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
      current(state).files.forEach((file) => {
        URL.revokeObjectURL(file.blobURL);
      });

      return {
        ...state,
        files: [],
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(convertFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(convertFiles.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadAllFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadAllFiles.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const {
  addConvertedFile,
  removeConvertedFile,
  removeAllConvertedFiles,
} = processFilesSlice.actions;

export const getAllProcessedFiles = (state) => state.processFiles.files;
export const isProcessingLoading = (state) => state.processFiles.loading;

export default processFilesSlice.reducer;
