import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  FLUSH,
  PAUSE,
  PERSIST,
  type PersistConfig,
  type PersistedState,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';

import { storage } from './storageAdapter';

import conversionSettingsReducer from './slices/conversionSettingsSlice/conversionSettingsSlice';
import { initialState as conversionSettingsInitialState } from './slices/conversionSettingsSlice/settings';
import type { ConversionSettingsState } from './slices/conversionSettingsSlice/types';
import processFilesReducer from './slices/processFilesSlice/processFilesSlice';
import sourceFilesReducer from './slices/sourceFilesSlice/sourceFilesSlice';

// Bump only for incompatible shape changes (renamed/removed keys, changed fields inside
// a format's settings): persisted state from older versions is dropped entirely.
// Adding a new output format does not require a bump — see reconcileConversionSettings.
const CONVERSION_SETTINGS_VERSION = 1;

// Formats missing from persisted state (e.g. added after the user's last visit) get their
// defaults; formats present in persisted state are kept as is, without a deep merge.
const reconcileConversionSettings = (
  inboundState: ConversionSettingsState,
  originalState: ConversionSettingsState,
  reducedState: ConversionSettingsState,
  config: PersistConfig<ConversionSettingsState>,
): ConversionSettingsState => {
  const merged = autoMergeLevel1(inboundState, originalState, reducedState, config);

  return {
    ...merged,
    outputSettings: {
      ...conversionSettingsInitialState.outputSettings,
      ...merged.outputSettings,
    },
  };
};

const conversionSettingsPersistConfig: PersistConfig<ConversionSettingsState> = {
  key: 'conversionSettings',
  storage,
  version: CONVERSION_SETTINGS_VERSION,
  stateReconciler: reconcileConversionSettings,
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
