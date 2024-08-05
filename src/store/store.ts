import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./persistStorage";

import sourceFilesReducer from "./slices/sourceFilesSlice/sourceFilesSlice";
import conversionSettingsReducer from "./slices/conversionSettingsSlice/conversionSettingsSlice";
import processFilesReducer from "./slices/processFilesSlice/processFilesSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["sourceFiles", "processFiles"],
};

const conversionSettingsPersistConfig = {
  key: "conversionSettings",
  storage,
};

const rootReducer = combineReducers({
  sourceFiles: sourceFilesReducer,
  conversionSettings: persistReducer(
    conversionSettingsPersistConfig,
    conversionSettingsReducer
  ),
  processFiles: processFilesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === 'development',
  });
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
