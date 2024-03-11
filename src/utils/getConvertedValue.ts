
import { SliderConvertModes } from "../types";

export const getConvertedValue = (value: number, mode: SliderConvertModes): number => {
  if (mode === SliderConvertModes.DecimalsToPercentages) {
    return +(Number(value) * 100).toFixed(0);
  } else if (mode === SliderConvertModes.PercentagesToDecimals) {
    return Number(value) / 100;
  } else if (mode === SliderConvertModes.GifDisplay) {
    return 20 - Number(value) + 1;
  } else {
    return 20 - Number(value) + 1;
  }
};
