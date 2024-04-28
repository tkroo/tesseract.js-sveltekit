<script>
  import { clickOutside } from "$lib/clickOutside";
  import { showmodal, modalimg, modalimg_name } from "$lib/toggleModal";
  import Remove from "$components/svg/remove-cancel-close-svgrepo-com.svelte";
  import { toggleModal } from "$lib/toggleModal";

  const handleWindowKeyDown = (e) => {
    if ($showmodal && e.key === "Escape") {
      toggleModal(false, "", "");
    }
  };
</script>

<svelte:body on:keydown={handleWindowKeyDown} />

{#if $showmodal}
  <div class="modal" role="dialog" aria-modal="true">
    <div
      class="modal-content"
      use:clickOutside
      on:clickOutside={() => {
        toggleModal(false, "", "");
      }}
    >
      <img src={$modalimg} alt={$modalimg_name} />
    </div>
    <button
      class="btn btn-sm btn-close"
      on:click={() => {
        toggleModal(false, "", "");
      }}><Remove /></button
    >
  </div>
{/if}

<style>
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
    box-shadow: 0px 4px 15px 8px rgba(0, 0, 0, 0.15);
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

  .btn {
    background-color: var(--color-accent);
    padding: 1rem 2rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    cursor: pointer;
  }
  .btn-sm {
    border: 0px solid var(--color-accent);
    color: var(--color-fg);
    padding: 0.5rem 1rem;
  }
</style>
