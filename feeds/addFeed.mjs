import { storeThing } from "../store/indexedDBStore.mjs";
import { FEED } from "../types.mjs";

/**
 * @param {HTMLFormElement} form
 */
const addFeed = (form) => {
  const data = new FormData(form);

  storeThing({
    type: FEED,
    id: Date.now().toString(),
    title: data.get("title"),
    url: data.get("url"),
  });

  return "/dayco-v2/feeds";
};

export default addFeed;
