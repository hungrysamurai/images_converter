import { MIME } from '@/types/formats';
import { getResizedCanvas } from '@/lib/utils/getResizedCanvas';
import encodeCanvas from './encode';
import { getInputFormatEntry } from './inputFormats';
import { getOutputFormatEntry } from './outputFormats';
import type { ConvertTask } from './types';

// TODO: temporary SVG-only white background, becomes a shared helper for all inputs
const withWhiteBackground = (canvas: OffscreenCanvas): OffscreenCanvas => {
  const result = new OffscreenCanvas(canvas.width, canvas.height);
  const ctx = result.getContext('2d') as OffscreenCanvasRenderingContext2D;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, result.width, result.height);
  ctx.drawImage(canvas, 0, 0);

  return result;
};

// Shared by the worker and the main thread fallback
export default async function runPipeline(task: ConvertTask): Promise<Blob[]> {
  const entry = getInputFormatEntry(task.type);
  if (!entry) throw new Error(`Unsupported file type: ${task.type}`);

  const decode = await entry.loadDecoder();
  const { resize, units, smoothing, targetWidth, targetHeight } = task.target.settings;
  const needsBackground = task.type === MIME.svg && !getOutputFormatEntry(task.target).alpha;

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
      canvas = withWhiteBackground(canvas);
    }

    blobs.push(await encodeCanvas(canvas, task.target));
  }

  return blobs;
}
