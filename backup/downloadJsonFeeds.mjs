// Inspired by https://stackoverflow.com/a/30800715

import { findAllThings } from "../store/indexedDBStore.mjs";
import { FEED } from "../types.mjs";

/**@typedef {import('../types.mjs').Feed} Feed */

const JSON_FEEDS_FILENAME = "feeds.json";

const downloadJsonFeeds = () => {
  return findAllThings(FEED).then((things) => {
    const feeds = /** @type {Feed[]} */ (things);

    const databaseContentDownloadUrl =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(feeds, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", databaseContentDownloadUrl);
    downloadAnchorNode.setAttribute("download", JSON_FEEDS_FILENAME);
    downloadAnchorNode.style.display = "none";
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });
};

export default downloadJsonFeeds;
