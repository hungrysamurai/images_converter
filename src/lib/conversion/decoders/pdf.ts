import PdfJsWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker';
import type { ConvertTask, Frame } from '../types';

// Add user rotation on top of the page's own /Rotate instead of overwriting it
const addRotation = (pageRotation: number, rotation: number) =>
  (((pageRotation + rotation) % 360) + 360) % 360;

// Don't rasterize PDF source, just split it into single page documents
async function* splitPDF(arrayBuffer: ArrayBuffer, rotation: number): AsyncGenerator<Frame> {
  const { degrees, PDFDocument } = await import('pdf-lib');

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  for (let index = 0; index < pageCount; index++) {
    const newDocument = await PDFDocument.create();
    const [copiedPage] = await newDocument.copyPages(pdfDoc, [index]);

    copiedPage.setRotation(degrees(addRotation(copiedPage.getRotation().angle, rotation)));

    newDocument.addPage(copiedPage);

    const bytes = await newDocument.save();

    yield new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
  }
}

async function* renderPDF(
  arrayBuffer: ArrayBuffer,
  resolution: number,
  rotation: number,
): AsyncGenerator<Frame> {
  const pdfjs = await import('pdfjs-dist');

  const worker = new PdfJsWorker();
  pdfjs.GlobalWorkerOptions.workerPort = worker;

  const document = {
    // @ts-expect-error -- `fonts` exists on WorkerGlobalScope, but self is typed as Window
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
      rotation: addRotation(page.rotate, rotation),
      dontFlip: false,
    });

    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    const renderContext = {
      canvas: null,
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    yield canvas;
  }
}

export default async function* decodePDF({
  blobURL,
  target,
  inputSettings,
}: ConvertTask): AsyncGenerator<Frame> {
  const { resolution, rotation } = inputSettings.pdf;

  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  if (target.format === 'pdf' && !target.settings.resize) {
    yield* splitPDF(arrayBuffer, rotation);
  } else {
    yield* renderPDF(arrayBuffer, resolution, rotation);
  }
}
