import {
  createSlice,
  createAsyncThunk,
  nanoid,
  current,
} from "@reduxjs/toolkit";

import { trimFileName } from "../../../utils/helpers/trimFileName";
import { isHEIC } from "../../../utils/helpers/isHEIC";

const initialState = [];

export const readSourceFileData = createAsyncThunk(
  "sourceFiles/readSourceFilesData",
  async (file, { dispatch }) => {
    return new Promise(() => {
      let { type, size } = file;

      // Handle HEIC
      if (!type) {
        type = isHEIC(file) ? "image/heic" : null;
      }

      const name = trimFileName(file.name);

      console.log(type);
      const blobURL = window.URL.createObjectURL(file);
      dispatch(
        addSourceFile({
          blobURL,
          name,
          type,
          size,
          id: nanoid(),
        })
      );
    });
  }
);

export const sourceFilesSlice = createSlice({
  name: "sourceFiles",
  initialState,
  reducers: {
    addSourceFile: (state, action) => {
      state.push(action.payload);
    },
    removeSourceFile: (state, action) => {
      const fileToRemove = current(state).find(
        (el) => el.id === action.payload
      );
      URL.revokeObjectURL(fileToRemove.blobURL);

      return state.filter((el) => el.id !== action.payload);
    },
  },
});

export const getAllSourceFiles = (state) => state.sourceFiles;

export const { addSourceFile, removeSourceFile } = sourceFilesSlice.actions;
export default sourceFilesSlice.reducer;
