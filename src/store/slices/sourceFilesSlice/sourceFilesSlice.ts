import { createSlice, PayloadAction, nanoid, current } from "@reduxjs/toolkit";

import { MIMETypes } from "../../../types/types";

import { trimFileName } from "../../../lib/helpers/trimFileName";

const initialState: SourceFile[] = [];

export const sourceFilesSlice = createSlice({
  name: "sourceFiles",
  initialState,
  reducers: (create) => ({
    addSourceFile: create.preparedReducer(
      (file: File): { payload: SourceFile } => {
        const name = trimFileName(file.name);
        const blobURL = window.URL.createObjectURL(file);

        return {
          payload: {
            blobURL,
            name,
            type: file.type as MIMETypes,
            size: file.size,
            id: nanoid(),
          },
        };
      },
      (state, action: PayloadAction<SourceFile>) => {
        state.push(action.payload);
      }
    ),

    removeSourceFile: create.reducer((state, action: PayloadAction<string>) => {
      const fileToRemove = current(state).find(
        (el) => el.id === action.payload
      );

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.blobURL);
      }

      return state.filter((el) => el.id !== action.payload);
    }),
  }),

  selectors: {
    getAllSourceFiles: (state): SourceFile[] => state,
    checkPDFInSourceFiles: (state) =>
      state.some((f) => f.type === MIMETypes.PDF),
  },
});

export const { addSourceFile, removeSourceFile } = sourceFilesSlice.actions;

export const { getAllSourceFiles, checkPDFInSourceFiles } =
  sourceFilesSlice.selectors;

export default sourceFilesSlice.reducer;
