import { PDFDocument } from 'pdf-lib';

const mergePDF = async (collection: MergeCollection): Promise<Blob> => {
  const merged = await PDFDocument.create();

  for (let i = 0; i < collection.length; i++) {
    const arrayBuffer = await (collection[i] as Blob).arrayBuffer();
    const docToAdd = await PDFDocument.load(arrayBuffer);

    const [page] = await merged.copyPages(docToAdd, [0]);

    merged.addPage(page);
  }

  const arrayBuffer = await merged.save();
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

  return blob;
};

export default mergePDF;
