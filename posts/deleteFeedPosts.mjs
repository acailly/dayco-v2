import { deleteThing, findAllThings } from "../store/indexedDBStore.mjs";
import { POST } from "../types.mjs";

/**@typedef {import('../types.mjs').Post} Post */

/**
 * @param {HTMLFormElement} form
 */
const deleteFeedPosts = (form) => {
  const data = new FormData(form);

  const feedId = data.get("feedId")?.toString();

  findAllThings(POST).then((things) => {
    const posts = /** @type {Post[]} */ (things);
    const feedPosts = posts.filter((post) => post.feedId === feedId);
    feedPosts.forEach((post) => {
      deleteThing(POST, post.id);
    });
  });

  // Remove list section
  const listSection = form.closest("post-list-section");
  if (listSection && listSection.firstElementChild) {
    const currentHeight =
      listSection.firstElementChild.getBoundingClientRect().height;
    const fadeOut = listSection.firstElementChild.animate(
      {
        opacity: [1, 0.2, 0],
        height: [`${currentHeight}px`, "0px", "0px"],
        margin: 0,
      },
      {
        duration: 500,
      }
    );
    fadeOut.onfinish = () => listSection.remove();
  }
};

export default deleteFeedPosts;
