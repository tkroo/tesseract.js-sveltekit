import { writable } from "svelte/store";

export const showmodal = writable(false);
export const modalimg = writable("");
export const modalimg_name = writable("");

function handleWheel(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

function toggleScroll(enable) {
  if (enable) {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.onscroll = function() { window.scrollTo(); };
  } else {
    window.removeEventListener('wheel', handleWheel);
    window.onscroll = function() { };
  }
}

export const toggleModal = (show, img, name) => {
  showmodal.set(show);
  toggleScroll(show);
  modalimg.set(img);
  modalimg_name.set(name);
}
