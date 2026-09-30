import type { OutputSettingsMap, OutputTarget } from '@/store/slices/conversionSettingsSlice/types';
import type { OutputFormat } from '@/types/formats';

export type Encoder<F extends OutputFormat> = (
  canvas: OffscreenCanvas,
  settings: OutputSettingsMap[F],
) => Promise<Blob>;

export type Aggregator<F extends OutputFormat> = (
  blobs: Blob[],
  settings: OutputSettingsMap[F],
) => Promise<Blob>;

export type OutputFormatEntry<F extends OutputFormat> = {
  loadEncoder: () => Promise<Encoder<F>>;
  // Aggregators run in main thread only
  loadAggregator?: () => Promise<Aggregator<F>>;
  alpha: boolean;
};

// All imports must stay lazy: the registry is part of the worker bundle
const loadCanvasEncoder = (format: 'jpeg' | 'png' | 'webp') => () =>
  import('./encoders/createCanvasEncoder').then((m) => m.default(format));

export const OUTPUT_FORMATS_REGISTRY: { [F in OutputFormat]: OutputFormatEntry<F> } = {
  jpeg: {
    loadEncoder: loadCanvasEncoder('jpeg'),
    alpha: false,
  },
  png: {
    loadEncoder: loadCanvasEncoder('png'),
    alpha: true,
  },
  webp: {
    loadEncoder: loadCanvasEncoder('webp'),
    alpha: true,
  },
  bmp: {
    loadEncoder: () => import('./encoders/encodeBMP').then((m) => m.default),
    alpha: false,
  },
  tiff: {
    loadEncoder: () => import('./encoders/encodeTIFF').then((m) => m.default),
    alpha: true,
  },
  gif: {
    loadEncoder: () => import('./encoders/encodeGIF').then((m) => m.default),
    loadAggregator: () => import('./aggregators/gif').then((m) => m.default),
    alpha: false,
  },
  pdf: {
    loadEncoder: () => import('./encoders/encodePDF').then((m) => m.default),
    loadAggregator: () => import('./aggregators/pdf').then((m) => m.default),
    alpha: false,
  },
};

export const getOutputFormatEntry = <F extends OutputFormat>(
  target: OutputTarget<F>,
): OutputFormatEntry<F> => OUTPUT_FORMATS_REGISTRY[target.format];

export const shouldMerge = (target: OutputTarget): boolean =>
  Boolean(getOutputFormatEntry(target).loadAggregator) &&
  'merge' in target.settings &&
  target.settings.merge;
