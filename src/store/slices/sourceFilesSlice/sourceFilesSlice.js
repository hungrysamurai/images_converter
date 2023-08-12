import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const initialState = [];

export const sourceFilesSlice = createSlice({
  name: "sourceFiles",
  initialState,
  reducers: {
    addSourceFile: {
      prepare: (file) => {
        const { name, type, size } = file;
        return {
          payload: {
            URL: window.URL.createObjectURL(file),
            name,
            type,
            size,
            id: nanoid(),
          },
        };
      },
      reducer: (state, action) => {
        state.push(action.payload);
      },
    },
  },
});

export const { addSourceFile } = sourceFilesSlice.actions;
export default sourceFilesSlice.reducer;
