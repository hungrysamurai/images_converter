import { getResizedCanvas } from '@/lib/utils/getResizedCanvas';
import { getCanvasWithWhiteBackground } from '@/lib/utils/getCanvasWithWhiteBackground';
import encodeCanvas from './encode';
import { getInputFormatEntry } from './inputFormats';
import { getOutputFormatEntry } from './outputFormats';
import type { ConvertTask } from './types';

// Shared by the worker and the main thread fallback
export default async function runPipeline(task: ConvertTask): Promise<Blob[]> {
  const entry = getInputFormatEntry(task.type);
  if (!entry) throw new Error(`Unsupported file type: ${task.type}`);

  const decode = await entry.loadDecoder();
  const { resize, units, smoothing, targetWidth, targetHeight } = task.target.settings;
  // Output without alpha channel would turn transparent pixels black
  const needsBackground = !getOutputFormatEntry(task.target).alpha;

  const blobs: Blob[] = [];

  for await (const frame of decode(task)) {
    if (frame instanceof Blob) {
      blobs.push(frame);
      continue;
    }

    let canvas = frame;

    if (resize && !entry.selfResizing) {
      canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
    }

    if (needsBackground) {
      canvas = getCanvasWithWhiteBackground(canvas);
    }

    blobs.push(await encodeCanvas(canvas, task.target));
  }

  return blobs;
}
