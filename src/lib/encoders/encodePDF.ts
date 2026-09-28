import { isCompressionSetting } from '@/types/typeGuards';
import type { OutputConversionSettings } from '@/store/slices/conversionSettingsSlice/types';

const encodePDF = async (
  canvas: OffscreenCanvas,
  targetFormatSettings: OutputConversionSettings,
): Promise<Blob> => {
  const { PDFDocument } = await import('pdf-lib');
  let pdfBytes;
  if (isCompressionSetting(targetFormatSettings)) {
    const { compression, quality } = targetFormatSettings;

    const blob = await canvas.convertToBlob({
      type: `image/${compression.toLowerCase()}`,
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

    pdfBytes = await pdfDoc.save();
  }
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
};

export default encodePDF;
