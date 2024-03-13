export const getPDFJS = async () => {
  const PDFJS = await import("pdfjs-dist/build/pdf");
  PDFJS.GlobalWorkerOptions.workerSrc = "/projects/images_converter/assets/pdf.worker.min.js";

  return PDFJS;
};
