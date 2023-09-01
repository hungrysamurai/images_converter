export const initialState = {
  inputSettings: {
    pdf: {
      resolution: 300,
      rotation: 0,
    },
  },
  outputSettings: {
    allFormats: ["jpeg", "png", "webp", "pdf", "bmp", "gif", "tiff"],
    activeTargetFormatName: "jpeg",
    settings: {
      jpeg: {
        resize: false,
        units: "pixels",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 0.75,
      },
      png: {
        resize: false,
        units: "pixels",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 1,
      },
      webp: {
        resize: false,
        units: "pixels",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 0.75,
      },
      bmp: {
        resize: false,
        units: "pixels",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
      },
      gif: {
        resize: false,
        units: "pixels",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        quality: 11,
        dither: false,
      },
      tiff: {
        resize: false,
        units: "pixels",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
      },
      pdf: {
        resize: false,
        units: "pixels",
        targetWidth: null,
        targetHeight: null,
        smoothing: "medium",
        compression: "JPG",
      },
    },
  },
};

export const GIFDitherOptions = [
  "off",
  "FloydSteinberg",
  "FloydSteinberg-serpentine",
  "FalseFloydSteinberg",
  "FalseFloydSteinberg-serpentine",
  "Stucki",
  "Stucki-serpentine",
  "Atkinson",
  "Atkinson-serpentine",
];

export const PDFCompressionOptions = ["PNG", "JPG"];

export const resizeUnits = ["pixels", "percentages"];

export const resizeSmoothingOptions = ["off", "low", "medium", "high"];
