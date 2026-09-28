import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  FLUSH,
  PAUSE,
  PERSIST,
  type PersistedState,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { storage } from './storageAdapter';

import conversionSettingsReducer from './slices/conversionSettingsSlice/conversionSettingsSlice';
import processFilesReducer from './slices/processFilesSlice/processFilesSlice';
import sourceFilesReducer from './slices/sourceFilesSlice/sourceFilesSlice';

const CONVERSION_SETTINGS_VERSION = 1;

const conversionSettingsPersistConfig = {
  key: 'conversionSettings',
  storage,
  version: CONVERSION_SETTINGS_VERSION,
  // Older persisted shapes are incompatible: drop them so the initial state applies
  migrate: (state: PersistedState) =>
    Promise.resolve(
      state && state._persist.version >= CONVERSION_SETTINGS_VERSION ? state : undefined,
    ),
};

const rootReducer = combineReducers({
  sourceFiles: sourceFilesReducer,
  conversionSettings: persistReducer(conversionSettingsPersistConfig, conversionSettingsReducer),
  processFiles: processFilesReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV ? true : false,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
