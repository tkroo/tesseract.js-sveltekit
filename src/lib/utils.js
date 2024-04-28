export function dataURItoFile(dataURI, name) {
  const byteString = atob(dataURI.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const [, contentType] = dataURI.split(/[:;]/);
  const blob = new Blob([ab], { type: contentType });
  return new File([blob], name, { type: contentType });
}