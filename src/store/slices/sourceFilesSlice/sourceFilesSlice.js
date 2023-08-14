import { createSlice, createAsyncThunk, nanoid, current } from "@reduxjs/toolkit";

import UTIF from "utif";
import UPNG from "upng-js";
import { trimFileName } from "../../../utils/trimFileName";

const initialState = [];

export const readSourceFilesData = createAsyncThunk(
  "sourceFiles/readSourceFilesData",
  async (file, { dispatch }) => {
    return new Promise(() => {
      const { type, size } = file;
      const name = trimFileName(file.name);
      // TIFF/PDF source
      if (type === "image/tiff" ||
        type === "application/pdf") {
        const blobURL = window.URL.createObjectURL(file);
        dispatch(
          addSourceFile({
            blobURL,
            name,
            type,
            size,
            id: nanoid(),
          })
        );
        // const reader = new FileReader();

        // reader.onload = (e) => {
        //   const arrayBuffer = e.target.result;
        //   const ifds = UTIF.decode(arrayBuffer);
        //   UTIF.decodeImage(arrayBuffer, ifds[0]);

        //   const rgba = UTIF.toRGBA8(ifds[0]);

        //   const pngData = UPNG.encode(
        //     [rgba.buffer],
        //     ifds[0].width,
        //     ifds[0].height,
        //     0
        //   );
        //   const blob = new Blob([pngData], { type: "image/png" });
        //   console.log(window.URL.createObjectURL(blob));
        // };

        // reader.readAsArrayBuffer(file);


        // JPEG/PNG/GIF/BMP/WEBP source
      } else {
        const blobURL = window.URL.createObjectURL(file);
        const img = new Image();
        img.src = blobURL;

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          dispatch(
            addSourceFile({
              blobURL,
              name,
              type,
              size,
              width,
              height,
              id: nanoid(),
            })
          );
        };
      }
    });
  }
);

export const sourceFilesSlice = createSlice({
  name: "sourceFiles",
  initialState,
  reducers: {
    addSourceFile: (state, action) => {
      state.push(action.payload);
    },
    removeSourceFile: (state, action) => {
      const fileToRemove = current(state).find(el => el.id === action.payload);
      URL.revokeObjectURL(fileToRemove.blobURL)

      return state.filter(el => el.id !== action.payload);
    }
  },
});

export const getAllSourceFiles = (state) => state.sourceFiles;

export const { addSourceFile, removeSourceFile } = sourceFilesSlice.actions;
export default sourceFilesSlice.reducer;

