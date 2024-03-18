import * as PDFJS from "pdfjs-dist";

export const getPDFJS = async () => {
  PDFJS.GlobalWorkerOptions.workerSrc = '/projects/images_converter/node_modules/pdfjs-dist/build/pdf.worker.js'
  return PDFJS;
};
