import { jsPDF } from "jspdf";
import { getResizedCanvas } from "../getResizedCanvas";

export const encodePdf = async (
  canvas,
  targetFormatSettings,
  activeTargetFormatName
) => {

  let resultingCanvas = canvas;
  const { resize, smoothing, targetHeight, targetWidth, compression } = targetFormatSettings;

  if (resize) {
    resultingCanvas = await getResizedCanvas(
      canvas,
      targetWidth,
      targetHeight,
      smoothing
    );
  }

  return new Promise((resolve, reject) => {
    let pdf;
    const canvasWidth = resultingCanvas.width;
    const canvasHeight = resultingCanvas.height;
    console.log(canvasHeight, canvasWidth);
    if (canvasWidth > canvasHeight) {
      pdf = new jsPDF("l", "px", [canvasWidth, canvasHeight]);
    } else {
      pdf = new jsPDF("p", "px", [canvasHeight, canvasWidth]);
    }

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(resultingCanvas, compression, 0, 0, width, height);

    resolve(pdf.output("blob"));
  });
};
