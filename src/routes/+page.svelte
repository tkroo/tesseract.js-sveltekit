<script>
  import { ocrFile, readImg } from "$lib/ocr";
  import Spinner from '$lib/90-ring-with-bg.svelte';
  import Remove from '$lib/remove-cancel-close-svgrepo-com.svelte';
  import { PdfToImg } from "pdftoimg-js";
  import { toggleModal, modalimg, modalimg_name, showmodal } from "$lib/toggleModal";
  import { clickOutside } from "$lib/clickOutside";

  /** * @type {Array<any>} */
  let results = [];
  /** * @type {HTMLInputElement} */
  let inputElement;

  let processing = false;

  /** * @param {Event & { target: HTMLInputElement }} e */
  const handleFiles = async (e) => {
    processing = true;
    if (e.target.files) {
    const theFiles = Array.from(e.target.files);

    for (let index = 0; index < theFiles.length; index++) {
      const file = theFiles[index];

      if (file.type == "application/pdf") {
        let imgs = await PdfToImg(file);
        for( let index = 0; index < imgs.length; index++) {
          let text = await ocrFile(imgs[index]);
          let name = file.name + "_page_" + (index+1);
          results = [...results, { img: imgs[index], text, name }];
        }
      } else {
        let img = await readImg(file);
        let text = await ocrFile(file);
        let name = file.name;
        results = [...results, { img, text, name }];
      }

    }
    processing = false;
    inputElement.value = "";
    inputElement.files = null;
    }
  };

  const handleWindowKeyDown = (e) => {
    if ($showmodal &&e.key === 'Escape') {
      toggleModal(false, "", "");
    }
  }

  const handleClickOutside = () => {
    console.log('handleClickOutside()');
    toggleModal(false, "", "");
  }

  
</script>
<svelte:body on:keydown={handleWindowKeyDown} />

{#if $showmodal}
<div class="modal" role="dialog" aria-modal="true">
  <div class="modal-content" use:clickOutside on:clickOutside={handleClickOutside}>
    <img src="{$modalimg}" alt="{$modalimg_name}">
  </div>
  <button class="btn btn-sm btn-close" on:click={() => {toggleModal(false, "", "")}}><Remove /></button>
</div>
{/if}

<div class="wrapper">

  <div class="heading">
    <span class="title">Tesseract.js</span>
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
    <span> Recognizing text ...</span>
    {/if}
    
    {#if results.length && !processing}
      <button class="btn btn-clear" on:click={() => {results = []}}>Clear results</button>
    {/if}
  </div>
  {#each results as r, i}
    <div class="horiz">
      <textarea rows="8" aria-label="text from image">{r.text}</textarea>
      <div class="foo">
        <button class="button-image" on:click={() => toggleModal(true, r.img, r.name)}>
          <img class="img" src={r.img} alt={r.name} />
        </button>
        <small>{r.name}</small>
      </div>
      <button class="btn btn-sm btn-close" aria-label="close" on:click={() => {results.splice(i, 1); results = results;}}><Remove /></button>
    </div>
  {/each}
</div>



<style>
  .wrapper {
    --color-fg: #f8f8f2;
    --color-bg: #282a36;
    --color-bg2: rgb(12, 19, 58) 6;
    --color-accent: #044672;
    --mysize: 200px;
    /* margin: 2rem; */
    position: relative;
    height: 100%;
    width: 100%;
    padding: 2rem;
  }

  .modal {
    z-index: 10;
    position: fixed;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: hsla(0, 0%, 100%, 0.85);
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    margin: 0 auto;
    padding: 0;
  }
  .modal img {
    /* box-shadow: 0 0 20px 8px rgba(0, 0, 0, 0.25); */
    box-shadow: 0px 4px 15px 8px rgba(0,0,0,0.15);
    max-width: 90vw;
    max-height: 90vh;
  }

  .modal .btn-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: #fff;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }

  .horiz {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--mysize), 1fr));

    /* display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: start; */
    border-radius: 0.25rem;
    background-color: #f1f1f1;
    gap: 1em;
    padding: 1em 1em 3em 1em;
    margin: 2rem 0 2rem 0;
    /* border-bottom: 1px solid black; */
  }

  .horiz textarea {
    font-family: inherit;
    font-size: 0.9rem;
  }

  .horiz .btn-close {
    width: fit-content;
    height: fit-content;
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background-color: transparent;
    padding: 0;
  }

  .horiz .button-image {
    border: 0;
    background-color: transparent;
    cursor: pointer;
    width: fit-content;
  }

  .horiz .foo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
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
    gap: 1rem;
    align-items: baseline;
    margin-bottom: 1rem;
  }
  .heading .title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .img {
    max-width: var(--mysize);
    max-height: var(--mysize);
    height: auto;
  }

  .fileinput {
    color: hsla(0, 0%, 100%, 0);
    width: 8rem;
    font-size: 12.8px;
    
    /* box-sizing: unset; */
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
  .btn-sm {
    border: 0px solid var(--color-accent);
    color: var(--color-fg);
    padding: 0.5rem 1rem;
  }

  .btn:disabled,
  .btn:disabled:hover {
    background-color: hsla(204, 93%, 20%, 0.5);
    cursor: auto;
  }
</style>
