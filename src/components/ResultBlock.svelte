<script>
  import { toggleModal } from "$lib/toggleModal";
  export let file;
  export let confidenceHighlighting = false;
</script>

<div class="horiz">
  <div class="woo">
    <textarea rows="8" aria-label="text from image">{file.text}</textarea>
    {#if confidenceHighlighting}
      <div class:confidence={confidenceHighlighting} class="hocr">
        {@html file.hocr}
      </div>
    {/if}
  </div>
  <div class="foo">
    <button
      class="button-image"
      on:click={() => toggleModal(true, file.uriString, file.name)}
    >
      <img class="img" src={file.uriString} alt={file.name} />
    </button>
    <small>{file.name}</small>
  </div>
</div>

<style>
  .horiz {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--mysize), 1fr));
    border-radius: 0.25rem;
    background-color: #f1f1f1;
    gap: 1em;
    padding: 1em 1em 3em 1em;
    margin: 2rem 0 2rem 0;
  }

  .horiz textarea {
    font-family: inherit;
    font-size: 0.9rem;
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

  .horiz .img {
    max-width: var(--mysize);
    max-height: var(--mysize);
    height: auto;
  }

  .hocr {
    background-color: #ffffff;
  }
</style>
