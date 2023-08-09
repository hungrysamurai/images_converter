import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 rawFiles: []
}

export const rawImagesSlice = createSlice({
 name: 'rawImages',
 initialState,
 reducers: {
  addRawImage: (state, action) => {
   state.rawFiles.push(action.payload);
  },
 }
})

export const { addRawImage } = rawImagesSlice.actions;
export default rawImagesSlice.reducer;
