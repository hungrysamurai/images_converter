import { configureStore } from "@reduxjs/toolkit";

import sourceFilesReducer from "./slices/sourceFilesSlice/sourceFilesSlice";

export const store = configureStore({
  reducer: {
    sourceFiles: sourceFilesReducer,
  },
});
