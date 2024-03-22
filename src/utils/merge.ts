import { AppDispatch } from "../store/store";
import { OutputFileFormatsNames } from "../types/types";

const merge = async (
 collection: MergeCollection,
 targetFormatSettings: OutputConversionSettings,
 activeTargetFormatName: OutputFileFormatsNames,
 dispatch: AppDispatch
) => {
 switch (activeTargetFormatName) {
  case OutputFileFormatsNames.PDF: {
   try {

   } catch (err) {

   }
   break;
  }
  case OutputFileFormatsNames.GIF: {
   try {

   } catch (err) {

   }
  }
 }
}

export default merge;