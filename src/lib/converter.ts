import { MIMETypes, OutputFileFormatsNames } from '../types/types';

import processMultiPagesFile from './decoders/multiPage/processMultiPageFile';
import processSinglePageFile from './decoders/singlePage/processSinglePageFile';

import { addConvertedFile } from '../store/slices/processFilesSlice/processFilesSlice';

import { nanoid } from '@reduxjs/toolkit';
import { AppDispatch } from '../store/store';

const processFile = async (
  source: SourceFile,
  outputSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  inputSettings: {
    [OutputFileFormatsNames.PDF]: PDFInputSettings;
  },
  dispatch: AppDispatch,
  mergeToOne: boolean,
  collection: MergeCollection,
): Promise<void> => {
  switch (source.type) {
    case MIMETypes.JPG:
    case MIMETypes.PNG:
    case MIMETypes.WEBP:
    case MIMETypes.BMP:
    case MIMETypes.HEIC:
    case MIMETypes.SVG:
      {
        const processed = processSinglePageFile(
          source,
          outputSettings,
          activeTargetFormatName,
          mergeToOne,
          collection,
        );

        processed.then((blob) => {
          const { name, id } = source;

          const size = blob.size;
          const URL = window.URL.createObjectURL(blob);

          dispatch(
            addConvertedFile({
              blobURL: URL,
              downloadLink: URL,
              name,
              size,
              type: `image/${activeTargetFormatName}` as MIMETypes,
              id: nanoid(),
              sourceId: id,
            }),
          );
        });

        // if (processed) {
        //   const { name, id } = source;

        //   const size = processed.size;
        //   const URL = window.URL.createObjectURL(processed);

        //   dispatch(
        //     addConvertedFile({
        //       blobURL: URL,
        //       downloadLink: URL,
        //       name,
        //       size,
        //       type: `image/${activeTargetFormatName}` as MIMETypes,
        //       id: nanoid(),
        //       sourceId: id,
        //     }),
        //   );
        // }
      }
      break;

    case MIMETypes.TIFF:
    case MIMETypes.GIF:
    case MIMETypes.PDF:
      {
        await processMultiPagesFile(
          source,
          outputSettings,
          activeTargetFormatName,
          inputSettings,
          dispatch,
          mergeToOne,
          collection,
        );
      }
      break;
  }
};

export default processFile;
