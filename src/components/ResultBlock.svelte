<script>
  import { toggleModal } from "$lib/toggleModal";
  // import Remove from "$components/svg/remove-cancel-close-svgrepo-com.svelte";
  // import Remove from "$components/svg/close-svgrepo-com.svelte";
  import Remove from "$components/svg/close-square-svgrepo-com.svelte";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  onMount(() => {
    correctLangAttributes();
  });

  const dispatch = createEventDispatcher();

  export let id;
  export let file;

  let confidenceHighlighting = false;


  function handleClose() {
    dispatch("message", {
      id: id,
    });
  }


  function correctLangAttributes() {
    let el = document.querySelectorAll(".hocr [lang='eng']");

    for (let i = 0; i < el.length; i++) {
      el[i].setAttribute("lang", "en");
    }
  }

</script>

<div class="horiz">
  <div class="woo">
    <div class="subhead">
      <small>document confidence: {file.confidence}</small>
      <label for="confidence"
        ><small>confidence highlighting</small>
        <input
          type="checkbox"
          id="confidence"
          bind:checked={confidenceHighlighting}
        />
      </label>
    </div>
    <div class:confidence={confidenceHighlighting} class="hocr" tabindex="-1">
      {@html file.hocr}
    </div>
  </div>
  <div class="foo">
    <small>{file.name}</small>
    <button
      class="button-image"
      on:click={() => toggleModal(true, file.uriString, file.name)}
    >
      <img class="img" src={file.uriString} alt={file.name} />
    </button>
  </div>
  <button class="btn btn-sm btn-close" on:click={handleClose}><Remove /></button
  >
</div>

<style>
  .horiz {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--mysize), 1fr));
    border-radius: 0.25rem;
    background-color: #f1f1f1;
    gap: 1em;
    padding: 1em 2em 3em 1em;
    margin: 2rem 0 2rem 0;
  }
  @media (max-width: 500px) {
    .horiz {
      --mysize: 200px;
    }
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
    max-width: var(--mysize);
  }

  .horiz .woo {
    z-index: 2;
    display: flex;
    flex-direction: column;
  }

  .horiz .subhead {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .horiz .foo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .horiz .img {
    display: block;
    /* width: var(--mysize); */
    max-width: 100%;
    /* max-height: var(--mysize); */
    height: auto;
  }

  .btn {
    border-radius: 0.25rem;
    border-width: 0;
    font-size: 0.8rem;
    cursor: pointer;
  }
  .btn-close {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    /* background-color: var(--color-accent); */
    padding: 0;
    border-radius: 0.25rem;
    max-width: 1.5rem;
    max-height: 1.5rem;
  }
  .btn-close:hover {
    background-color: var(--color-accent-hover);
  }
  .btn-sm {
    /* border: 0px solid var(--color-accent); */
    color: var(--color-fg);
    /* padding: 0.25rem; */
    line-height: 0;
  }

  @keyframes select {
    to {
      -webkit-user-select: text;
      user-select: text;
    }
  }
</style>
