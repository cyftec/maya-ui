import { signal } from "@cyftech/signal";

export const hash = signal(document.location.hash);
export const path = signal(document.location.pathname);

window.onhashchange = () => {
  console.log(`New hash is: ${document.location.hash}`);
  hash.value = document.location.hash;
};
window.onpopstate = () => {
  console.log(`New pathname is: ${document.location.pathname}`);
  path.value = document.location.pathname;
};
