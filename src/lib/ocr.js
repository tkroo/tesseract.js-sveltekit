import { createWorker, PSM, OEM } from "tesseract.js";
import PdfToImg from "pdftoimg-js";


/**
 * Reads an image file and returns a promise that resolves with the data URL of the image.
 *
 * @param {File} file - The image file to be read.
 * @return {Promise<string>} A promise that resolves with the data URL of the image.
 */
export const readImg = async (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else if (result instanceof ArrayBuffer) {
        resolve(new TextDecoder().decode(result));
      } else {
        reject(new Error('Failed to read image.'));
      }
    };
  });

}

export const convertPdfToImg = async (file) => {
  return await PdfToImg(file);
}

/**
 * Reads an image file (or a data URI string) and returns a promise that resolves with the data URL of the image.
 *
 * @param {(string|File)} file - The image file to be read.
 * @return {Promise<string>} A promise that resolves with the data URL of the image.
 */
export const ocrFile = async (file, lang = "eng") => {
  const worker = await createWorker(lang, 1);
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO_OSD,
  })
  // (async () => {
  // })();
  const ret = await worker.recognize(file);
  await worker.terminate();
  console.log("ret", ret);
  return ret;
};
