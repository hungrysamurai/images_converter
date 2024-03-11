export enum MIMETypes {
  JPG = "image/jpeg",
  PNG = "image/png",
  GIF = "image/gif",
  WEBP = "image/webp",
  BMP = "image/bmp",
  TIFF = "image/tiff",
  HEIC = "image/heic",
  PDF = "application/pdf",
}

export enum FileFormatsNames {
  JPG = "jpeg",
  PNG = "png",
  GIF = "gif",
  WEBP = "webp",
  BMP = "bmp",
  TIFF = "tiff",
  HEIC = "heic",
  PDF = "pdf",
}

export enum Lang {
  EN = "en",
  RU = "ru",
}

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

declare global {
  type SourceFile = {
    blobURL: string;
    name: string;
    type: MIMETypes;
    size: number;
    id: string;
  };

  type ProcessedFile = SourceFile & {
    downloadLink: string;
    sourceId: string;
  };


  type OutputFileFormatsNames = Exclude<
    FileFormatsNames,
    FileFormatsNames.HEIC
  >;

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

  interface GIFOutputConversionSettings
    extends JPEG_PNG_WEBPOutputConversionSettings {
    dither: GIFDitherOptions | false;
  }

  interface PDFOutputConversionSettings extends OutputConversionSettings {
    compression: PDFCompressionTypes;
  }

  type GeneralOutputConversionSettings = OutputConversionSettings &
    GIFOutputConversionSettings &
    PDFOutputConversionSettings;

  type PropertyValue<T> = {
    [P in keyof T]: {
      property: P;
      value: T[P];
    };
  }[keyof T];

  type SingleOutputSetting = PropertyValue<GeneralOutputConversionSettings>;

  interface PDFInputSettings {
    resolution: number;
    rotation: number;
  }

  interface ConversionSettings {
    inputSettings: {
      [FileFormatsNames.PDF]: PDFInputSettings;
    };
    outputSettings: {
      allFormats: OutputFileFormatsNames[];
      activeTargetFormatName: OutputFileFormatsNames;
      settings: {
        [key in OutputFileFormatsNames]:
        | OutputConversionSettings
        | GIFOutputConversionSettings
        | PDFOutputConversionSettings;
      };
    };
  }
}
