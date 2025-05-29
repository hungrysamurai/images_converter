import { PDFDocument, PDFImage } from 'pdf-lib';

import { isCompressionSetting } from '../../types/typeGuards';
import { PDFCompressionTypes } from '../../types/types';

import canvasToBlob from './canvasToBlob';

const encodePDF = async (
  canvas: HTMLCanvasElement,
  targetFormatSettings: OutputConversionSettings,
): Promise<Blob | void> => {
  if (isCompressionSetting(targetFormatSettings)) {
    const { compression, quality } = targetFormatSettings;

    const blob = await canvasToBlob(canvas, compression, quality);
    const arrayBuffer = await blob.arrayBuffer();

    const pdfDoc = await PDFDocument.create();

    let image: PDFImage;

    if (compression === PDFCompressionTypes.JPG) {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else {
      image = await pdfDoc.embedPng(arrayBuffer);
    }

    const page = pdfDoc.addPage([canvas.width, canvas.height]);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });

    const pdfBytes = await pdfDoc.save();

    return new Blob([pdfBytes], { type: 'application/pdf' });
  }
};

export default encodePDF;
