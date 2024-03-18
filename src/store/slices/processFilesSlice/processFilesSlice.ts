import {
  createSlice,
  createAsyncThunk,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../store";

import processFile from "../../../utils/converter";

import { zipAndSave } from "../../../utils/zipAndSave";
import { getFileFormat } from "../../../utils/helpers/getFileFormat";

const initialState: ProcessFilesState = {
  loading: false,
  files: [],
};

export const convertFiles = createAsyncThunk<
  void,
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("processFiles/convertFiles", async (_: void, { getState, dispatch }) => {
  const state = getState();
  const { sourceFiles, conversionSettings } = state;

  for (const source of sourceFiles) {
    try {
      await processFile(source, conversionSettings, dispatch);
    } catch (err) {
      console.error(
        `Error processing file ${source.name}.${getFileFormat(source.type)}:`,
        (err as Error).message
      );
      // dispatch(removeSourceFile(source.id));
    }
  }
});

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
    addConvertedFile: (state, action: PayloadAction<ProcessedFile>) => {
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
    removeConvertedFile: (state, action: PayloadAction<string>) => {
      const fileToRemove = current(state).files.find(
        (el) => el.id === action.payload
      );

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.blobURL);
      }

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

export const getAllProcessedFiles = (state: RootState) =>
  state.processFiles.files;
export const isProcessingLoading = (state: RootState) =>
  state.processFiles.loading;

export default processFilesSlice.reducer;
