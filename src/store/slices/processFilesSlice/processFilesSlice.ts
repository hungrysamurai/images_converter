import {
  createSlice,
  createAsyncThunk,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../store";

import processFile from "../../../utils/converter";
import merge from "../../../utils/merge";

import { zipAndSave } from "../../../utils/zipAndSave";
import { getFileFormat } from "../../../utils/helpers/getFileFormat";
import { isMergeSetting } from "../../../utils/typeGuards";


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

  const { inputSettings, outputSettings } = conversionSettings;

  const { activeTargetFormatName } = outputSettings;
  const targetFormatSettings = outputSettings.settings[activeTargetFormatName];

  const mergeToOne = isMergeSetting(targetFormatSettings) ? targetFormatSettings.merge : false

  const collection: MergeCollection = []

  for (const source of sourceFiles) {
    try {
      await processFile(
        source,
        targetFormatSettings,
        activeTargetFormatName,
        inputSettings,
        dispatch,
        mergeToOne,
        collection
      );
    } catch (err) {
      console.error(
        `Error processing file ${source.name}.${getFileFormat(source.type)}:`,
        (err as Error).message
      );
    }
  }

  if (mergeToOne) {
    try {
      await merge(collection, targetFormatSettings, activeTargetFormatName, dispatch)
    } catch (err) {
      console.log(err);
    }
  }
});

export const downloadAllFiles = createAsyncThunk<
  void,
  void,
  {
    state: RootState
  }
>(
  "processFiles/downloadAllFiles",
  async (_: void, { getState }) => {
    const state = getState();
    const {
      processFiles: { files },
      conversionSettings: {
        outputSettings: { activeTargetFormatName },
      },
    } = state;

    try {
      await zipAndSave(files, activeTargetFormatName);
    } catch (err) {
      console.error(
        `Error generating zip archive:`,
        (err as Error).message
      );
    }
  }
);

const processFilesSlice = createSlice({
  name: "processFiles",
  initialState,
  reducers: {
    addConvertedFile: (state, action: PayloadAction<ProcessedFile>) => {
      const isSameFileInState = current(state).files.some(file => file.name === action.payload.name)

      let name = action.payload.name;

      if (isSameFileInState) {
        name = `${name}_${Date.now()}`
      }

      state.files.push({ ...action.payload, name });
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
