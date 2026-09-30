import { MIME } from '@/types/formats';
import { getInputFormatEntry } from './inputFormats';
import runPipeline from './pipeline';
import type { ConvertTask, WorkerResponse } from './types';

// TODO: legacy dispatch for formats not yet migrated to the pipeline
const runLegacyDecoder = async (task: ConvertTask): Promise<Blob[]> => {
  const { type, blobURL, target, pdfInputSettings, bitmap } = task;

  switch (type) {
    case MIME.svg: {
      if (!bitmap) throw new Error('Missing bitmap for SVG conversion');

      const decodeSVGBitmap = await import('@/lib/conversion/decoders/singlePage/svg');

      return [await decodeSVGBitmap.default(target, bitmap)];
    }

    case MIME.tiff: {
      const TIFFPagesToBlobs = await import('@/lib/conversion/decoders/multiPage/tiff');

      return TIFFPagesToBlobs.default(blobURL, target);
    }

    case MIME.pdf: {
      if (!pdfInputSettings) throw new Error('Missing pdfInputSettings for PDF conversion');
      const PDFPagesToBlobs = await import('@/lib/conversion/decoders/multiPage/pdf');

      return PDFPagesToBlobs.default(blobURL, target, pdfInputSettings);
    }

    case MIME.gif: {
      const decodeGIF = await import('@/lib/conversion/decoders/multiPage/gif');

      return decodeGIF.default(blobURL, target);
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
