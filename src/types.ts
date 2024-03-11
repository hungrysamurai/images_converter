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

export enum InputFileFormatsNames {
  JPG = "jpeg",
  PNG = "png",
  GIF = "gif",
  WEBP = "webp",
  BMP = "bmp",
  TIFF = "tiff",
  HEIC = "heic",
  PDF = "pdf",
}

export enum OutputFileFormatsNames {
  JPG = "jpeg",
  PNG = "png",
  GIF = "gif",
  WEBP = "webp",
  BMP = "bmp",
  TIFF = "tiff",
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

export enum SliderConvertModes {
  DecimalsToPercentages = 'decimalsToPercentages',
  PercentagesToDecimals = 'percentagesToDecimals',
  GifDisplay = "gifDisplay",
  GifState = "gifState"
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

  // type OutputFileFormatsNames = Exclude<
  //   InputFileFormatsNames,
  //   InputFileFormatsNames.HEIC
  // >;

  type ResizeOption = {
    resize: boolean;
  }

  type ResizeUnitsOption = {
    units: ResizeUnits
  }

  type TargetWidthOption = {
    targetWidth: number | null;
  }

  type TargetHeightOption = {
    targetHeight: number | null;
  }

  type SmoothingOption = {
    smoothing: SmoothingPresets | false;
  }

  type QualityOption = {
    quality: number;
  }

  type DitherOption = {
    dither: GIFDitherOptions | false;
  }

  type CompressionOption = {
    compression: PDFCompressionTypes;
  }

  type BasicOutputConversionSettings = ResizeOption & ResizeUnitsOption & TargetWidthOption & TargetHeightOption & SmoothingOption

  type JPEG_WEBPOutputConversionSettings = BasicOutputConversionSettings & QualityOption

  type GIFOutputConversionSettings = JPEG_WEBPOutputConversionSettings & DitherOption;

  type PDFOutputConversionSettings = BasicOutputConversionSettings & CompressionOption


  // interface BasicOutputConversionSettings {
  //   resize: boolean
  //   units: ResizeUnits;
  //   targetWidth: number | null;
  //   targetHeight: number | null;
  //   smoothing: SmoothingPresets | false;
  // }

  // interface JPEG_WEBPOutputConversionSettings
  //   extends BasicOutputConversionSettings {
  //   quality: number;
  // }

  // interface GIFOutputConversionSettings
  //   extends JPEG_WEBPOutputConversionSettings {
  //   dither: GIFDitherOptions | false;
  // }

  // interface PDFOutputConversionSettings extends BasicOutputConversionSettings {
  //   compression: PDFCompressionTypes;
  // }

  // type AllOutputConversionSettings = BasicOutputConversionSettings &
  //   GIFOutputConversionSettings &
  //   PDFOutputConversionSettings;

  // type PropertyValue<T> = {
  //   [P in keyof T]: {
  //     property: P;
  //     value: T[P];
  //   };
  // }[keyof T];

  // type UpdateOutputSettingsActionPayload = PropertyValue<AllOutputConversionSettings>

  interface PDFInputSettings {
    resolution: number;
    rotation: number;
  }

  interface ConversionSettings {
    inputSettings: {
      [InputFileFormatsNames.PDF]: PDFInputSettings;
    };
    outputSettings: {
      allFormats: OutputFileFormatsNames[];
      activeTargetFormatName: OutputFileFormatsNames;
      settings: {
        // [key in OutputFileFormatsNames]: BasicOutputConversionSettings
        // | GIFOutputConversionSettings
        // | PDFOutputConversionSettings;
        [InputFileFormatsNames.JPG]: JPEG_WEBPOutputConversionSettings,
        [InputFileFormatsNames.WEBP]: JPEG_WEBPOutputConversionSettings,
        [InputFileFormatsNames.PNG]: BasicOutputConversionSettings,
        [InputFileFormatsNames.TIFF]: BasicOutputConversionSettings,
        [InputFileFormatsNames.GIF]: GIFOutputConversionSettings,
        [InputFileFormatsNames.BMP]: BasicOutputConversionSettings,
        [InputFileFormatsNames.PDF]: PDFOutputConversionSettings,
      };
    };
  }
}
