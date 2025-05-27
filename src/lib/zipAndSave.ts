import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

import { saveAs } from 'file-saver';

import { OutputFileFormatsNames } from '../types/types';
import { getFileFormat } from './helpers/getFileFormat';

export const zipAndSave = async (
  files: ProcessedFile[],
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    let count = 0;
    const zipFilename = `converted_to_${activeTargetFormatName}`;

    for (const file of files) {
      const { name, blobURL, type } = file;

      const nameWithExtension = `${name}.${getFileFormat(type)}`;

      JSZipUtils.getBinaryContent(blobURL, async (err, data) => {
        try {
          zip.file(nameWithExtension, data, { binary: true });
          count++;

          if (count == files.length) {
            const zipFile = await zip.generateAsync({ type: 'blob' });
            resolve(saveAs(zipFile, zipFilename));
          }

          if (err) {
            throw err;
          }
        } catch (err) {
          reject(err);
        }
      });
    }
  });
};
