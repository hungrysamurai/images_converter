import type { MIMEType, OutputFormat } from './formats';
import type {
  Dither,
  PDFCompression,
  ResizeUnits,
  Smoothing,
} from '@/store/slices/conversionSettingsSlice/types';

export enum Lang {
  EN = 'en',
  RU = 'ru',
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
    units: ResizeUnits;
  };

  type SmoothingOption = {
    smoothing: Smoothing | false;
  };

  type DitherOption = {
    dither: Dither | false;
  };

  type CompressionOption = {
    compression: PDFCompression;
  };

  type SelectOptions = UnitsOption | SmoothingOption | DitherOption | CompressionOption;

  type SelectOptionsValues = ResizeUnits | Smoothing | Dither | PDFCompression;
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
