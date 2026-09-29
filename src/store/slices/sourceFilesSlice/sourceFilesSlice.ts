import { createSlice, current, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { MIME, type MIMEType } from '@/types/formats';

import { trimFileName } from '@/lib/utils/trimFileName';
import type { SourceFile } from '@/types/files';

const initialState: SourceFile[] = [];

export const sourceFilesSlice = createSlice({
  name: 'sourceFiles',
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
            type: file.type as MIMEType,
            size: file.size,
            id: nanoid(),
          },
        };
      },
      (state, action: PayloadAction<SourceFile>) => {
        state.push(action.payload);
      },
    ),

    removeSourceFile: create.reducer((state, action: PayloadAction<string>) => {
      const fileToRemove = current(state).find((el) => el.id === action.payload);

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.blobURL);
      }

      return state.filter((el) => el.id !== action.payload);
    }),

    reorderSourceFiles: create.reducer(
      (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
        const from = state.findIndex((el) => el.id === action.payload.activeId);
        const to = state.findIndex((el) => el.id === action.payload.overId);

        if (from === -1 || to === -1 || from === to) return;

        const [moved] = state.splice(from, 1);
        state.splice(to, 0, moved);
      },
    ),
  }),

  selectors: {
    getAllSourceFiles: (state): SourceFile[] => state,
    checkPDFInSourceFiles: (state) => state.some((f) => f.type === MIME.pdf),
  },
});

export const { addSourceFile, removeSourceFile, reorderSourceFiles } = sourceFilesSlice.actions;

export const { getAllSourceFiles, checkPDFInSourceFiles } = sourceFilesSlice.selectors;

export default sourceFilesSlice.reducer;
