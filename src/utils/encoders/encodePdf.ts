import { jsPDF } from "jspdf";
import { getResizedCanvas } from "../getResizedCanvas";
import { isCompressionSetting } from "../typeGuards";

export const encodePdf = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings
): Promise<Blob | void> => {

  let resultingCanvas = canvas;

  if (isCompressionSetting(targetFormatSettings)) {

    const { resize, units, smoothing, targetHeight, targetWidth, compression } =
      targetFormatSettings;

    if (resize) {
      resultingCanvas = await getResizedCanvas(
        canvas,
        targetWidth,
        targetHeight,
        smoothing,
        units
      );
    }

    let pdf: jsPDF;
    const canvasWidth = resultingCanvas.width;
    const canvasHeight = resultingCanvas.height;

    if (canvasWidth > canvasHeight) {
      pdf = new jsPDF("l", "px", [canvasWidth, canvasHeight]);
    } else {
      pdf = new jsPDF("p", "px", [canvasHeight, canvasWidth]);
    }

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(resultingCanvas, compression, 0, 0, width, height);

    return pdf.output("blob")
  }
};
