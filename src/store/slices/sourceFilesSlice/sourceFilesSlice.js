import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const initialState = [];

export const readSourceFilesData = createAsyncThunk(
  "sourceFiles/readSourceFilesData",
  async (file, { dispatch }) => {
    return new Promise(() => {
      const { name, type, size } = file;
      const blobURL = window.URL.createObjectURL(file);

      const img = new Image();
      img.src = blobURL;

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        console.log(width, height);
        dispatch(
          addSourceFile({
            blobURL,
            name,
            type,
            size,
            width,
            height,
            id: nanoid(),
          })
        );
      };
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
  },
});

export const getAllSourceFiles = (state) => state.sourceFiles;

export const { addSourceFile } = sourceFilesSlice.actions;
export default sourceFilesSlice.reducer;
