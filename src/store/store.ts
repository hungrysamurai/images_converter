import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import conversionSettingsReducer from './slices/conversionSettingsSlice/conversionSettingsSlice';
import processFilesReducer from './slices/processFilesSlice/processFilesSlice';
import sourceFilesReducer from './slices/sourceFilesSlice/sourceFilesSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['sourceFiles', 'processFiles'],
};

const conversionSettingsPersistConfig = {
  key: 'conversionSettings',
  storage,
};

const rootReducer = combineReducers({
  sourceFiles: sourceFilesReducer,
  conversionSettings: persistReducer(conversionSettingsPersistConfig, conversionSettingsReducer),
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
  devTools: import.meta.env.DEV ? true : false,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
