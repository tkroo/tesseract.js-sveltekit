<script>
  import { PdfToImg } from "pdftoimg-js";
  import { dataURItoFile } from "$lib/utils";
  import Spinner from "$components/svg/90-ring-with-bg.svelte";
  import ResultBlock from "$components/ResultBlock.svelte";
  import Modal from "$components/Modal.svelte";
  import { ocrFile, readImg } from "$lib/ocr";

  let processing = false;
  let inputElement;
  let results = [];
  let lang = "eng";

  async function processFile(file) {
    const results = await Promise.allSettled([await readImg(file), await ocrFile(file, lang)]);

    const id = results[1].value.jobId;
    const { text, hocr, confidence, psm } = results[1].value.data;

    return {
      uriString: results[0].value,
      text,
      hocr,
      confidence,
      psm,
      name: file.name,
      id
    };
  }

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

  function handleMessage(event) {
    console.log("event.detail.id", event.detail.id);
    results = results.filter((result) => result.id != event.detail.id);
  }
</script>


<Modal />

<div class="wrapper">
  <div class="heading">
    <h1 class="title">Tesseract.js</h1>
    <span>Extract text from images and pdfs</span>
  </div>
  <div class="form">
    <label for="fileinput"
        ><small>Drag and drop or click to select files</small></label
      >
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
  
      <!-- <select bind:value={lang} name="lang" id="lang">
        {#each Object.keys(languages) as l}
          <option value={languages[l]}>{l}</option>
        {/each}
      </select> -->
  
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
  
    <div class="results_main">
      {#each results as r}
      <ResultBlock file={r} id={r.id} on:message={handleMessage} />
    {/each}
    </div>
</div>

<style>
  .wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 2rem;
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .heading {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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
    border-width: 0px;
    border-radius: 0.25rem;
    background-color: transparent;
    color: var(--color-fg);
    cursor: pointer;
    word-break: break-all;
    position: relative;
  }

  .btn {
    background-color: var(--color-accent);
    border-width: 0;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    cursor: pointer;
    height: 2rem;
    font-weight: bold;
  }
  .btn:hover,
  .fileinput:hover {
    background-color: var(--color-accent-hover);
  }
  .btn-clear {
    color: var(--color-fg);
  }

  .btn:disabled,
  .btn:disabled:hover {
    background-color: hsla(204, 93%, 20%, 0.5);
    cursor: auto;
  }
  small {
    font-size: 0.7rem;
  }
</style>