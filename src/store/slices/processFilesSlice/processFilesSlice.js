import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { testImageProcess } from "../../../utils/converter";

const initialState = {
  loading: false,
  files: [],
};

export const convertFiles = createAsyncThunk(
  "processFiles/convertFiles",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const {
      sourceFiles,
      conversionSettings: { activeTargetFormat, targetFormats },
    } = state;

    const targetFormat = targetFormats[activeTargetFormat].name;

    for (const { blobURL } of sourceFiles) {
      const processed = await testImageProcess(blobURL, targetFormat);
      dispatch(addConvertedFile(URL.createObjectURL(processed)));

      //   const blob = await fetch(URL).then((res) => res.blob());

      //   const reader = new FileReader();
      //   reader.readAsDataURL(blob);
      //   reader.onloadend = async function () {
      //     const base64data = reader.result;
      //     const processed = await testImageProcess(base64data, targetFormat);
      //     // result.push(processed);
      //   };
    }

    // console.log(result);
  }
);

const processFilesSlice = createSlice({
  name: "processFiles",
  initialState,
  reducers: {
    addConvertedFile: (state, action) => {
      state.files.push(action.payload);
    },
  },
  //   extraReducers(builder) {
  //     builder.addCase();
  //   },
});

export const { addConvertedFile } = processFilesSlice.actions;

export const getAllProcessedFiles = (state) => state.processFiles.files;
export const isProcessingLoading = (state) => state.processFiles.loading;

export default processFilesSlice.reducer;
