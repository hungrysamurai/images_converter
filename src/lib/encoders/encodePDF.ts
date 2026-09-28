import { MIME } from '@/types/formats';
import type { PDFOutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

const encodePDF = async (
  canvas: OffscreenCanvas,
  settings: PDFOutputConversionSettings,
): Promise<Blob> => {
  const { PDFDocument } = await import('pdf-lib');
  const { compression, quality } = settings;

  const blob = await canvas.convertToBlob({
    type: MIME[compression],
    quality: quality / 100,
  });
  const arrayBuffer = await blob.arrayBuffer();

  const pdfDoc = await PDFDocument.create();

  let image;

  if (compression === 'jpeg') {
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

  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: MIME.pdf });
};

export default encodePDF;
