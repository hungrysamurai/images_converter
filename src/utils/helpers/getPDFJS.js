export const getPDFJS = async () => {
  const PDFJS = await import("pdfjs-dist/build/pdf");
  PDFJS.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.js";

  return PDFJS;
};
