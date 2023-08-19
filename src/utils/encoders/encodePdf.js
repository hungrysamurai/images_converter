import { jsPDF } from "jspdf";

export const encodePdf = async (canvas) => {
  return new Promise((resolve, reject) => {
    let pdf;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (canvasWidth > canvasHeight) {
      pdf = new jsPDF("l", "px", [canvasWidth, canvasHeight]);
    } else {
      pdf = new jsPDF("p", "px", [canvasHeight, canvasWidth]);
    }

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(canvas, "PNG", 0, 0, width, height);
    resolve(pdf.output("blob"));
  });
};
