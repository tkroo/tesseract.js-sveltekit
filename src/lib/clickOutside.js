/** Dispatch event on click outside of node */
export function clickOutside(node) {
  console.log('clickOutside node : ', node)
  const handleClick = (event) => {
    console.log('event : ', event)
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('clickOutside', node)
      )
    }
  }

	document.addEventListener('click', handleClick, true);
  
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
	}
}