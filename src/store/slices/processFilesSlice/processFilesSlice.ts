import { asyncThunkCreator, buildCreateSlice, current, PayloadAction } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '../../store';

import Converter from '../../../lib/Converter';
import { zipAndSave } from '../../../lib/utils/zipAndSave';
import { isMergeSetting } from '../../../types/typeGuards';

const createProcessFilesSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const initialState: ProcessFilesState = {
  loading: false,
  files: [],
};

const processFilesSlice = createProcessFilesSlice({
  name: 'processFiles',
  initialState,

  reducers: (create) => ({
    convertFiles: create.asyncThunk<void, void>(
      async (_: void, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        const dispatch = thunkApi.dispatch as AppDispatch;

        const { sourceFiles, conversionSettings } = state;

        const { inputSettings, outputSettings } = conversionSettings;

        const { activeTargetFormatName } = outputSettings;
        const targetFormatSettings = outputSettings.settings[activeTargetFormatName];

        const mergeToOne = isMergeSetting(targetFormatSettings)
          ? targetFormatSettings.merge
          : false;

        const converter = new Converter(
          targetFormatSettings,
          activeTargetFormatName,
          inputSettings,
          dispatch,
          mergeToOne,
        );

        try {
          await converter.convert(sourceFiles);
        } catch (err) {
          console.error(err);
        }

        converter.dispose();
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state) => {
          state.loading = false;
        },
      },
    ),

    addConvertedFile: create.reducer((state, action: PayloadAction<ProcessedFile>) => {
      const isSameFileInState = current(state).files.some(
        (file) => file.name === action.payload.name,
      );

      let name = action.payload.name;

      if (isSameFileInState) {
        name = `${name}_${Date.now()}`;
      }

      state.files.push({ ...action.payload, name });
    }),

    removeConvertedFile: create.reducer((state, action: PayloadAction<string>) => {
      const fileToRemove = current(state).files.find((el) => el.id === action.payload);

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.blobURL);
      }

      return {
        ...state,
        files: state.files.filter((el) => el.id !== action.payload),
      };
    }),

    removeAllConvertedFiles: create.reducer((state) => {
      current(state).files.forEach((file) => {
        URL.revokeObjectURL(file.blobURL);
      });

      return {
        ...state,
        files: [],
      };
    }),

    downloadAllFiles: create.asyncThunk<void, void>(
      async (_: void, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        const {
          processFiles: { files },
          conversionSettings: {
            outputSettings: { activeTargetFormatName },
          },
        } = state;

        try {
          await zipAndSave(files, activeTargetFormatName);
        } catch (err) {
          console.error(`Error generating zip archive:`, (err as Error).message);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state) => {
          state.loading = false;
        },
      },
    ),
  }),
});

export const {
  addConvertedFile,
  removeConvertedFile,
  removeAllConvertedFiles,
  convertFiles,
  downloadAllFiles,
} = processFilesSlice.actions;

export const getAllProcessedFiles = (state: RootState) => state.processFiles.files;
export const isProcessingLoading = (state: RootState) => state.processFiles.loading;

export default processFilesSlice.reducer;
