import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

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

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.MODE_ENV === 'development',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
