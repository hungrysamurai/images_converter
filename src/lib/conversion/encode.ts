import { getOutputFormatEntry } from './outputFormats';
import type { OutputTarget } from '@/store/slices/conversionSettingsSlice/types';
import type { OutputFormat } from '@/types/formats';

export default async function encodeCanvas<F extends OutputFormat>(
  canvas: OffscreenCanvas,
  target: OutputTarget<F>,
): Promise<Blob> {
  const encode = await getOutputFormatEntry(target).loadEncoder();

  return encode(canvas, target.settings);
}
