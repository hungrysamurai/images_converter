import { jsPDF } from "jspdf";
import { isCompressionSetting } from "../typeGuards";

const encodePDF = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings
): Promise<Blob | void> => {

  let resultingCanvas = canvas;

  if (isCompressionSetting(targetFormatSettings)) {

    const { compression } =
      targetFormatSettings;

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

export default encodePDF;
/*
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://unpkg.com/pdf-lib@1.4.0"></script>
    <script src="https://unpkg.com/downloadjs@1.4.7"></script>
  </head>

  <body>
    <p>Click the button to embed PNG and JPEG images with <code>pdf-lib</code></p>
    <button onclick="embedImages()">Create PDF</button>
    <p class="small">(Your browser will download the resulting file)</p>
  </body>

  <script>
    const { PDFDocument } = PDFLib

    async function embedImages() {
      // Fetch PNG image
      const pngUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
      const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer())

      // Create a new PDFDocument
      const pdfDoc = await PDFDocument.create()

      const pngImage = await pdfDoc.embedPng(pngImageBytes)

      // Get the width/height of the PNG image
      const pngDims = pngImage.scale(1)

      // Add a blank page to the document
      const page = pdfDoc.addPage([pngDims.width, pngDims.height])

      // Draw the PNG image near the lower right corner of the JPG image
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngDims.width,
        height: pngDims.height,
      })

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save()

      // Trigger the browser to download the PDF document
      download(pdfBytes, "pdf-lib_image_embedding_example.pdf", "application/pdf");
    }
  </script>
</html>
*/