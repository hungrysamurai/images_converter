export const getPDFJS = async () => {
 const PDFJS = await import('pdfjs-dist/build/pdf');
 PDFJS.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.js';

 return PDFJS;
}
