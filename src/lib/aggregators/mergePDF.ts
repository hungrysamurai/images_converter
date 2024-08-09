import { PDFDocument, PDFImage } from "pdf-lib";
import canvasToBlob from "../encoders/canvasToBlob";
import { isCompressionSetting } from "../typeGuards";
import { MIMETypes } from "../../types/types";

const mergePDF = async (
  collection: MergeCollection,
  targetFormatSettings: OutputConversionSettings
): Promise<Blob | void> => {
  if (isCompressionSetting(targetFormatSettings)) {
    const { compression, quality } = targetFormatSettings;

    const merged = await PDFDocument.create();

    for (let i = 0; i < collection.length; i++) {
      if (collection[i] instanceof HTMLCanvasElement) {
        const canvas = collection[i] as HTMLCanvasElement;
        const blob = await canvasToBlob(canvas, compression, quality);
        const arrayBuffer = await blob.arrayBuffer();

        let image: PDFImage;

        if (blob.type === MIMETypes.JPG) {
          image = await merged.embedJpg(arrayBuffer);
        } else {
          image = await merged.embedPng(arrayBuffer);
        }

        const page = merged.addPage([canvas.width, canvas.height]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
        });
      } else {
        const arrayBuffer = await (collection[i] as Blob).arrayBuffer();
        const docToAdd = await PDFDocument.load(arrayBuffer);

        const [page] = await merged.copyPages(docToAdd, [0]);

        merged.addPage(page);
      }
    }

    const arrayBuffer = await merged.save();

    const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    return blob;
  }
};

export default mergePDF;
