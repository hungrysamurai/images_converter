import { configureStore } from '@reduxjs/toolkit';

import rawImagesReducer from './slices/rawImages/rawImagesSlice';

export const store = configureStore({
 reducer: {
  rawImages: rawImagesReducer
 }
})