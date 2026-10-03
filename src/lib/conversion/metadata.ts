import type { InputFormatEntry } from './inputFormats';
import { getOutputFormatEntry, shouldKeepMetadata } from './outputFormats';
import type { ConvertTask } from './types';

// Metadata problems never fail the conversion: the file goes out without EXIF

// Re-reads the source independently of the decoder, only when both formats support EXIF
// and the setting is on
export const readSourceExif = async (
  task: ConvertTask,
  input: InputFormatEntry,
): Promise<Uint8Array | null> => {
  if (!input.loadExifExtractor || !shouldKeepMetadata(task.target)) return null;

  try {
    const [extract, source] = await Promise.all([
      input.loadExifExtractor(),
      fetch(task.blobURL).then((response) => response.arrayBuffer()),
    ]);
    const exif = extract(new Uint8Array(source));

    if (!exif) console.warn(`No EXIF found in ${task.type} source, metadata is not kept`);

    return exif;
  } catch (err) {
    console.warn(`Failed to read EXIF from ${task.type} source, metadata is not kept:`, err);
    return null;
  }
};

export const embedExif = async (
  encoded: Blob,
  exif: Uint8Array,
  task: ConvertTask,
): Promise<Blob> => {
  const loadWriter = getOutputFormatEntry(task.target).loadExifWriter;
  if (!loadWriter) return encoded;

  try {
    const [write, { patchExif }] = await Promise.all([loadWriter(), import('./exif/tiff')]);

    return await write(encoded, patchExif(exif));
  } catch (err) {
    console.warn(
      `Failed to write EXIF to ${task.target.format} output, metadata is not kept:`,
      err,
    );
    return encoded;
  }
};
