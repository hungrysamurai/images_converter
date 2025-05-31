import HEICToBlob from './worker_decoders/HEICToBlob';

addEventListener('message', async (e) => {
  const { type, payload, outputSettings, targetFormatName } = e.data;

  try {
    switch (type) {
      case 'decode_heic': {
        const blob = await HEICToBlob(payload, outputSettings, targetFormatName);
        postMessage(blob);
      }
    }
  } catch (err) {
    setTimeout(() => {
      throw err;
    });
  }
});
