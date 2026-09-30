import runPipeline from './pipeline';
import type { ConvertTask, WorkerResponse } from './types';

self.addEventListener('message', async (e: MessageEvent<ConvertTask>) => {
  let response: WorkerResponse;

  try {
    response = { ok: true, blobs: await runPipeline(e.data) };
  } catch (err) {
    response = { ok: false, message: err instanceof Error ? err.message : String(err) };
  }

  postMessage(response);
});
