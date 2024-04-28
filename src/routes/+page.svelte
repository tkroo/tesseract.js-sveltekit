<script>
  import { PdfToImg } from "pdftoimg-js";
  import { dataURItoFile } from "$lib/utils";
  import Spinner from "$components/svg/90-ring-with-bg.svelte";
  import ResultBlock from "$components/ResultBlock.svelte";
  import Modal from "$components/Modal.svelte";
  import { ocrFile, readImg } from "$lib/ocr";

  /**
   * @type {boolean}
   */
  let processing = false;

  /**
   * @type {HTMLInputElement}
   */
  let inputElement;

  /**
   * @type {Array<{uriString: string, text: string, name: string}>}
   */
  let results = [];

  /**
   * @param {File} file
   * @returns {Promise<{uriString: string, text: string, name: string}>}
   */
  async function processFile(file) {
    const uriString = await readImg(file);
    const text = await ocrFile(file);
    const name = file.name;
    return { uriString, text, name };
  }

  /**
   * @param {Event} e
   * @returns {Promise<void>}
   */
  const handleFiles = async (e) => {
    processing = true;
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const theFiles = Array.from(e.target.files);
      for (let index = 0; index < theFiles.length; index++) {
        const file = theFiles[index];
        if (file.type == "application/pdf") {
          let imgs = await PdfToImg(file);
          for (let index = 0; index < imgs.length; index++) {
            let name = file.name + "_page_" + (index + 1);
            let f = dataURItoFile(imgs[index], name);
            let r = await processFile(f);
            results = [...results, r];
          }
        } else {
          let name = file.name;
          let r = await processFile(file);
          results = [...results, r];
        }
      }
      processing = false;
      inputElement.value = "";
      inputElement.files = null;
    }
  };
</script>

<Modal />

<div class="wrapper">
  <div class="heading">
    <h1 class="title">Tesseract.js</h1>
    <span>Extract text from images and pdfs</span>
  </div>
  <div class="interact">
    <label for="fileinput">Drag and drop or click to select files</label>
    <input
      id="fileinput"
      class="btn fileinput"
      bind:this={inputElement}
      on:change={(e) => handleFiles(e)}
      disabled={processing}
      type="file"
      multiple
      accept="image/jpg, image/jpeg, image/png, image/webp, image/pbm, image/bmp, application/pdf"
    />

    {#if processing}
      <Spinner />
      <span>Recognizing text ...</span>
    {/if}

    {#if results.length && !processing}
      <button
        class="btn btn-clear"
        on:click={() => {
          results = [];
        }}>Clear results</button
      >
    {/if}
  </div>

  {#each results as r}
    <ResultBlock file={r} />
  {/each}
</div>

<style>
  .wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 2rem;
  }
  .interact {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .heading {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* gap: 1rem; */
    align-items: baseline;
    margin-bottom: 1rem;
  }
  .heading .title {
    margin: 0 1rem 0 0;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .fileinput {
    color: hsla(0, 0%, 100%, 0);
    width: 8rem;
    font-size: 12.8px;
  }

  .fileinput::file-selector-button {
    font-weight: bold;
    font-family: inherit;
    border: 1px solid var(--color-accent);
    border-radius: 0.25rem;
    background-color: transparent;
    color: var(--color-fg);
    cursor: pointer;
    word-break: break-all;
    position: relative;
  }

  .fileinput:hover {
    background-color: hsl(204, 93%, 20%);
  }
  .btn {
    background-color: var(--color-accent);
    padding: 1rem 2rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    cursor: pointer;
  }
  .btn-clear {
    border: 1px solid var(--color-accent);
    color: var(--color-fg);
  }

  .btn:disabled,
  .btn:disabled:hover {
    background-color: hsla(204, 93%, 20%, 0.5);
    cursor: auto;
  }
</style>
