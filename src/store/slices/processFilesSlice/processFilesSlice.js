import { createSlice, createAsyncThunk, nanoid, current } from "@reduxjs/toolkit";

import { processImage } from "../../../utils/converter";

const initialState = {
  loading: false,
  files: [],
};

export const convertFiles = createAsyncThunk(
  "processFiles/convertFiles",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const { sourceFiles, conversionSettings } = state;
    const { activeTargetFormat, targetFormats } = conversionSettings;

    const targetFormat = targetFormats[activeTargetFormat].name;

    for (const source of sourceFiles) {
      const { width, height, name, id } = source;

      const processed = await processImage(
        source, conversionSettings
      );

      const size = processed.size;
      const URL = window.URL.createObjectURL(processed);

      dispatch(addConvertedFile(
        {
          blobURL: URL,
          downloadLink: URL,
          name: `${name}.${targetFormat}`,
          width,
          height,
          size,
          type: `image/${targetFormat}`,
          id: nanoid(),
          sourceId: id,
        }
      ))
    }
  }
);

const processFilesSlice = createSlice({
  name: "processFiles",
  initialState,
  reducers: {
    addConvertedFile: (state, action) => {
      state.files.push(action.payload);
    },
    removeConvertedFile: (state, action) => {
      const fileToRemove = current(state).files.find(el => el.id === action.payload);
      URL.revokeObjectURL(fileToRemove.blobURL)

      return {
        ...state,
        files: state.files.filter(el => el.id !== action.payload)
      }
    }
  },
  //   extraReducers(builder) {
  //     builder.addCase();
  //   },
});

export const { addConvertedFile, removeConvertedFile } = processFilesSlice.actions;

export const getAllProcessedFiles = (state) => state.processFiles.files;
export const isProcessingLoading = (state) => state.processFiles.loading;

export default processFilesSlice.reducer;
