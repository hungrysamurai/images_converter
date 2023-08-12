import { configureStore } from "@reduxjs/toolkit";

import sourceFilesReducer from "./slices/sourceFilesSlice/sourceFilesSlice";
import conversionSettingsReducer from "./slices/conversionSettingsSlice/conversionSettingsSlice";

export const store = configureStore({
  reducer: {
    sourceFiles: sourceFilesReducer,
    conversionSettings: conversionSettingsReducer,
  },
});
