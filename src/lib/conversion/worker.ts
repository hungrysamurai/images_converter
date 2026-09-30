import { MIME } from '@/types/formats';
import { getInputFormatEntry } from './inputFormats';
import runPipeline from './pipeline';
import type { ConvertTask, WorkerResponse } from './types';

// TODO: legacy dispatch for formats not yet migrated to the pipeline
const runLegacyDecoder = async (task: ConvertTask): Promise<Blob[]> => {
  const { type, target, bitmap } = task;

  switch (type) {
    case MIME.svg: {
      if (!bitmap) throw new Error('Missing bitmap for SVG conversion');

      const decodeSVGBitmap = await import('@/lib/conversion/decoders/svg');

      return [await decodeSVGBitmap.default(target, bitmap)];
    }

    default:
      throw new Error(`Unsupported file type: ${type}`);
  }
};

self.addEventListener('message', async (e: MessageEvent<ConvertTask>) => {
  const task = e.data;
  let response: WorkerResponse;

  try {
    const blobs = getInputFormatEntry(task.type)
      ? await runPipeline(task)
      : await runLegacyDecoder(task);

    response = { ok: true, blobs };
  } catch (err) {
    response = { ok: false, message: err instanceof Error ? err.message : String(err) };
  }

  postMessage(response);
});
