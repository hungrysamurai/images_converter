import type { MIMEType, OutputFormat } from './formats';

export enum Lang {
  EN = 'en',
  RU = 'ru',
}

export enum Units {
  PIXELS = 'pixels',
  PERCENTAGES = 'percentages',
  PPI = 'ppi',
  DEG = 'deg',
  MS = 'ms',
}

export enum SmoothingPresets {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  OFF = 'off',
}

export enum GIFDitherOptions {
  FloydSteinberg = 'FloydSteinberg',
  FloydSteinbergSerpentine = 'FloydSteinberg-serpentine',
  FalseFloydSteinberg = 'FalseFloydSteinberg',
  FalseFloydSteinbergSerpentine = 'FalseFloydSteinberg-serpentine',
  Stucki = 'Stucki',
  StuckiSerpentine = 'Stucki-serpentine',
  Atkinson = 'Atkinson',
  AtkinsonSerpentine = 'Atkinson-serpentine',
  OFF = 'off',
}

export enum PDFCompressionTypes {
  JPG = 'jpeg',
  PNG = 'png',
}

export enum SliderConvertModes {
  DecimalsToPercentages = 'decimalsToPercentages',
  PercentagesToDecimals = 'percentagesToDecimals',
  GifDisplay = 'gifDisplay',
  GifState = 'gifState',
}

export enum ScreenOrientations {
  Vertical = 'max-aspect-ratio: 1/1',
  Horizontal = 'min-aspect-ratio: 1/1',
}

export enum ElementColorMode {
  Light = 'light',
  Dark = 'dark',
}

declare global {
  type SourceFile = {
    blobURL: string;
    name: string;
    type: MIMEType;
    size: number;
    id: string;
  };

  type ProcessedFile = SourceFile & {
    downloadLink: string;
    sourceId?: string;
  };

  // Checkbox
  type ResizeOption = {
    resize: boolean;
  };

  type MergeOption = {
    merge: boolean;
  };

  type CheckboxOptions = ResizeOption | MergeOption;

  type CheckboxOptionsKeys = keyof ResizeOption | keyof MergeOption;

  // Slider
  type QualityOption = {
    quality: number;
  };

  // Select
  type UnitsOption = {
    units: Units;
  };

  type SmoothingOption = {
    smoothing: SmoothingPresets | false;
  };

  type DitherOption = {
    dither: GIFDitherOptions | false;
  };

  type CompressionOption = {
    compression: PDFCompressionTypes;
  };

  type SelectOptions = UnitsOption | SmoothingOption | DitherOption | CompressionOption;

  type SelectOptionsValues = Units | SmoothingPresets | GIFDitherOptions | PDFCompressionTypes;
  type SelectOptionsKeys =
    keyof UnitsOption | keyof SmoothingOption | keyof DitherOption | keyof CompressionOption;

  // Output numeric settings
  type TargetWidthOption = {
    targetWidth: number | null;
  };

  type TargetHeightOption = {
    targetHeight: number | null;
  };

  type GIFAnimationDelay = {
    animationDelay: number;
  };

  // Input numeric settings
  type PDFInputSettings = {
    resolution: number;
    rotation: number;
  };

  type NumericOptions =
    TargetHeightOption | TargetWidthOption | PDFInputSettings | GIFAnimationDelay;

  type NumericOptionsKeys =
    | keyof TargetHeightOption
    | keyof TargetWidthOption
    | keyof PDFInputSettings
    | keyof GIFAnimationDelay;

  // Comp
  type BasicOutputConversionSettings = ResizeOption &
    UnitsOption &
    TargetWidthOption &
    TargetHeightOption &
    SmoothingOption;

  type JPEG_WEBPOutputConversionSettings = BasicOutputConversionSettings & QualityOption;

  type GIFOutputConversionSettings = JPEG_WEBPOutputConversionSettings &
    DitherOption &
    MergeOption &
    GIFAnimationDelay;

  type PDFOutputConversionSettings = BasicOutputConversionSettings &
    CompressionOption &
    MergeOption &
    QualityOption;

  type OutputConversionSettings =
    | BasicOutputConversionSettings
    | JPEG_WEBPOutputConversionSettings
    | GIFOutputConversionSettings
    | PDFOutputConversionSettings;

  type CombinedOutputConversionSettings = BasicOutputConversionSettings &
    JPEG_WEBPOutputConversionSettings &
    GIFOutputConversionSettings &
    PDFOutputConversionSettings;

  interface ConversionSettings {
    inputSettings: {
      pdf: PDFInputSettings;
    };
    outputSettings: {
      allFormats: OutputFormat[];
      activeTargetFormatName: OutputFormat;
      settings: {
        jpeg: JPEG_WEBPOutputConversionSettings;
        webp: JPEG_WEBPOutputConversionSettings;
        png: BasicOutputConversionSettings;
        tiff: BasicOutputConversionSettings;
        gif: GIFOutputConversionSettings;
        bmp: BasicOutputConversionSettings;
        pdf: PDFOutputConversionSettings;
      };
    };
  }

  interface ProcessFilesState {
    loading: boolean;
    files: ProcessedFile[];
  }

  type MergeCollection = Blob[];

  interface ConvertTaks {
    type: MIMEType;
    blobURL: string;
    outputSettings: OutputConversionSettings;
    targetFormatName: OutputFormat;
    inputSettings?: {
      pdf: PDFInputSettings;
    };
    bitmap?: ImageBitmap;
  }

  type ConvertTaskResult = Blob | Blob[];
}
