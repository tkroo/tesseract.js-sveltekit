import { createWorker, PSM } from "tesseract.js";
import PdfToImg from "pdftoimg-js";


// export const handleFiles = async (files) => {
//   const theFiles = Array.from(files);

//   theFiles.forEach(async (file) => {
//     let img = await readImg(file);
//     let text = await ocrFile(file);
//     results = [...results, {img, text}];
//   })
//   files = [];
//   inputElement.value = null;
// }


/**
 * Reads an image file and returns a promise that resolves with the data URL of the image.
 *
 * @param {File} file - The image file to be read.
 * @return {Promise<string>} A promise that resolves with the data URL of the image.
 */
export const readImg = async (file) => {

  if (file.type == "application/pdf") {
    return "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGRhdGEtbmFtZT0iTGF5ZXIgMiIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMy44NCAzLjg0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPGRlZnM+CiAgPHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO308L3N0eWxlPgogPC9kZWZzPgogPGcgc3Ryb2tlLXdpZHRoPSIuMTAwNzkiPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTAuMjQ2OTMgMC4wNTAzOTRhMC4yMDE1NyAwLjIwMTU3IDAgMCAwLTAuMTk2NTQgMC4yMDE1N3YzLjMzNjFhMC4yMDE1NyAwLjIwMTU3IDAgMCAwIDAuMjAxNTcgMC4yMDE1N2gzLjMzNjFhMC4yMDE1NyAwLjIwMTU3IDAgMCAwIDAuMjAxNTctMC4yMDE1N3YtMy4zNDExYTAuMjAxNTcgMC4yMDE1NyAwIDAgMC0wLjIwMTU3LTAuMTk2NTR6Ii8+CiAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMS41MjA5IDIuNTE5N3YtMS4yMDk0aDAuMjAxNTdhMC42MDQ3MiAwLjYwNDcyIDAgMCAxIDAuNjA0NzIgMC42MDQ3MiAwLjYwNDcyIDAuNjA0NzIgMCAwIDEtMC42MDQ3MiAwLjYwNDcyeiIvPgogIDxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjIuNzY5NiIgeDI9IjMuMzcyMyIgeTE9IjEuMzE0MyIgeTI9IjEuMzE0MyIvPgogIDxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjIuNzY5NiIgeDI9IjMuMTYyNyIgeTE9IjEuOTE3IiB5Mj0iMS45MTciLz4KICA8bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIyLjc2OTYiIHgyPSIyLjc2OTYiIHkxPSIxLjMxNDMiIHkyPSIyLjUxOTciLz4KICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0wLjQ1NzU3IDIuNTE5N3YtMS4yMDk0aDAuNDAzMTVhMC40MDMxNSAwLjQwMzE1IDAgMCAxIDAgMC44MDYzaC0wLjQwMzE1Ii8+CiA8L2c+Cjwvc3ZnPgo="
  }

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
export const ocrFile = async (file) => {
  const worker = await createWorker("eng");
  (async () => {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
    })
  })
  const ret = await worker.recognize(file);
  await worker.terminate();
  console.log("ret", ret);
  return ret.data;
};
