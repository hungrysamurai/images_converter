import { AppDispatch } from "../store/store";
import { OutputFileFormatsNames } from "../types/types";
import mergePDF from "./aggregators/mergePDF";

const merge = async (
 collection: MergeCollection,
 targetFormatSettings: OutputConversionSettings,
 activeTargetFormatName: OutputFileFormatsNames,
 dispatch: AppDispatch
): Promise<void> => {
 switch (activeTargetFormatName) {
  case OutputFileFormatsNames.PDF: {
   try {
    const merged = await mergePDF(collection);

   } catch (err) {
    throw err;
   }
   break;
  }
  case OutputFileFormatsNames.GIF: {
   try {

   } catch (err) {
    throw err;
   }
  }
 }
}

export default merge;