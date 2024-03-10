import { FileFormatsNames } from "../../../types";

export enum ResizeUnits {
  PIXELS = "pixels",
  PERCENTAGES = "percentages",
}

export enum SmoothingPresets {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  OFF = "off",
}

export enum GIFDitherOptions {
  FloydSteinberg = "FloydSteinberg",
  FloydSteinbergSerpentine = "FloydSteinberg-serpentine",
  FalseFloydSteinberg = "FalseFloydSteinberg",
  FalseFloydSteinbergSerpentine = "FalseFloydSteinberg-serpentine",
  Stucki = "Stucki",
  StuckiSerpentine = "Stucki-serpentine",
  Atkinson = "Atkinson",
  AtkinsonSerpentine = "Atkinson-serpentine",
  OFF = "off",
}

export enum PDFCompressionTypes {
  JPG = "JPG",
  PDF = "PDF",
}

interface OutputConversionSettings {
  resize: boolean;
  units: ResizeUnits;
  targetWidth: number | null;
  targetHeight: number | null;
  smoothing: SmoothingPresets | false;
}

interface JPEG_PNG_WEBPOutputConversionSettings
  extends OutputConversionSettings {
  quality: number;
}

interface GIFOutputConversionSettings extends OutputConversionSettings {
  dither: GIFDitherOptions | false;
}

interface PDFOutputConversionSettings extends OutputConversionSettings {
  compression: PDFCompressionTypes;
}

interface PDFInputSettings {
  resolution: number;
  rotation: number;
}

interface ConversionSettings {
  inputSettings: {
    [key in FileFormatsNames]?: PDFInputSettings;
  };
  outputSettings: {
    allFormats: FileFormatsNames[];
    activeTargetFormatName: FileFormatsNames;
    settings: {
      [key in FileFormatsNames]?:
        | OutputConversionSettings
        | JPEG_PNG_WEBPOutputConversionSettings
        | GIFOutputConversionSettings
        | PDFOutputConversionSettings;
    };
  };
}

export const initialState: ConversionSettings = {
  inputSettings: {
    pdf: {
      resolution: 300,
      rotation: 0,
    },
  },
  outputSettings: {
    allFormats: [
      FileFormatsNames.JPG,
      FileFormatsNames.PDF,
      FileFormatsNames.WEBP,
      FileFormatsNames.PDF,
      FileFormatsNames.BMP,
      FileFormatsNames.GIF,
      FileFormatsNames.TIFF,
    ],
    activeTargetFormatName: FileFormatsNames.JPG,
    settings: {
      jpeg: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      png: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 1,
      },
      webp: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 0.75,
      },
      bmp: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      gif: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        quality: 11,
        dither: false,
      },
      tiff: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
      },
      pdf: {
        resize: false,
        units: ResizeUnits.PIXELS,
        targetWidth: null,
        targetHeight: null,
        smoothing: SmoothingPresets.MEDIUM,
        compression: PDFCompressionTypes.JPG,
      },
    },
  },
};
