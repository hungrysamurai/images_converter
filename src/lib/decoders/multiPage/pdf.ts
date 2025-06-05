import PdfJsWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker';
import { OutputFileFormatsNames } from '../../../types/types';
import encodeCanvas from '../../encode';
import { getResizedCanvas } from '../../utils/getResizedCanvas';

const decodePDF = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
  inputSettings: { [OutputFileFormatsNames.PDF]: PDFInputSettings },
): Promise<Blob[]> => {
  const {
    pdf: { resolution, rotation },
  } = inputSettings;

  const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

  const pagesBlobs: Blob[] = [];

  // Don't rasterize PDF Source, just split it!
  if (activeTargetFormatName === OutputFileFormatsNames.PDF && !targetFormatSettings.resize) {
    const { degrees, PDFDocument } = await import('pdf-lib');

    const blob = await fetch(blobURL);
    const arrayBuffer = await blob.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    const arrays = await Promise.all(
      pages.map(async (_, index) => {
        const newDocument = await PDFDocument.create();
        const [copiedPage] = await newDocument.copyPages(pdfDoc, [index]);

        copiedPage.setRotation(degrees(rotation));

        newDocument.addPage(copiedPage);

        return await newDocument.save();
      }),
    );

    arrays.forEach((arr) => {
      const blob = new Blob([arr], { type: 'application/pdf' });
      pagesBlobs.push(blob);
    });
  } else {
    const pdfjs = await import('pdfjs-dist');
    const blob = await fetch(blobURL);
    const arrayBuffer = await blob.arrayBuffer();

    const worker = new PdfJsWorker();
    pdfjs.GlobalWorkerOptions.workerPort = worker;

    const document = {
      //@ts-ignore
      fonts: self.fonts,
      createElement: (name: string) => {
        if (name == 'canvas') {
          return new OffscreenCanvas(1, 1);
        }
        return null;
      },
    };

    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      ownerDocument: document as HTMLDocument,
    });
    const pdf = await loadingTask.promise;

    const { numPages } = pdf._pdfInfo;

    for (let i = 1; i < numPages + 1; i++) {
      const page = await pdf.getPage(i);
      const scale = resolution / 72;

      const viewport = page.getViewport({
        scale,
        rotation,
        dontFlip: false,
      });

      let canvas = new OffscreenCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext('2d');

      const renderContext = {
        canvasContext: ctx as unknown as CanvasRenderingContext2D,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      if (resize) {
        canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
      }

      const encoded = await encodeCanvas(canvas, targetFormatSettings, activeTargetFormatName);

      pagesBlobs.push(encoded);
    }
  }

  return pagesBlobs;
};

export default decodePDF;
