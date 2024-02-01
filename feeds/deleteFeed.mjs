import { deleteThing } from "../store/indexedDBStore.mjs";
import { FEED } from "../types.mjs";

/**
 * @param {HTMLFormElement} form
 */
const deleteFeed = (form) => {
  const data = new FormData(form);

  const id = data.get("id")?.toString();

  if (id) {
    deleteThing(FEED, id);
  }

  return window.location.href;
};

export default deleteFeed;
