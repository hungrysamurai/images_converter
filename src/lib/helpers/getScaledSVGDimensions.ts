import { Units } from "../../types/types";

export const getScaledSVGDimensions = (
 currentHeight: number,
 currentWidth: number,
 units: Units,
 targetWidth: number | null,
 targetHeight: number | null
): {
 width: string;
 height: string;
} => {

 if (targetWidth && !targetHeight) {

  // Calculate targetHeight based on the aspect ratio
  targetHeight = (currentHeight / currentWidth) * targetWidth
 } else if (!targetWidth && targetHeight) {

  // Calculate targetWidth based on the aspect ratio
  targetWidth = (currentWidth / currentHeight) * targetHeight;
 }

 const unitsName = units === Units.PERCENTAGES ? "%" : "px"

 return {
  width: `${targetWidth}${unitsName}`,
  height: `${targetHeight}${unitsName}`
 }
}