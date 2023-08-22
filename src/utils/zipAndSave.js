import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";

export const zipAndSave = async (files, activeTargetFormatName) => {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    let count = 0;
    const zipFilename = `converted_to_${activeTargetFormatName}`;

    for (const file of files) {
      const { name, blobURL } = file;

      JSZipUtils.getBinaryContent(blobURL, async (err, data) => {
        zip.file(name, data, { binary: true });
        count++;

        if (count == files.length) {
          const zipFile = await zip.generateAsync({ type: "blob" });
          resolve(saveAs(zipFile, zipFilename));
        }
      });
    }
  });
};
