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
}
