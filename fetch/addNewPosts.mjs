import * as store from '../store/indexedDBStore.mjs'
import { POST, FEED } from '../types.mjs'

/**@typedef {import('../types.mjs').Feed} Feed */
/**@typedef {import('../types.mjs').Post} Post */
/**@typedef {import('../types.mjs').PostWithoutFeed} PostWithoutFeed */

/**
 * @param {Feed['id']} feedId
 * @param {PostWithoutFeed[]} newPosts
 * @returns {Promise<void>}
 */
async function addNewPosts(feedId, newPosts) {
  const thing = await store.findThingById(FEED, feedId)

  if (!thing) {
    return
  }

  const feed = /** @type {Feed} */ (thing)

  let currentLastFetchTimestamp = feed.lastFetchTimestamp
  let newLastFetchTimestamp = currentLastFetchTimestamp

  for (let newPostIndex = 0; newPostIndex < newPosts.length; newPostIndex++) {
    const newPost = newPosts[newPostIndex]

    if (!currentLastFetchTimestamp || newPost.timestamp > currentLastFetchTimestamp) {
      /** @type {Post} */
      const postToStore = {
        type: POST,
        id: newPost.url,
        title: newPost.title,
        url: newPost.url,
        timestamp: newPost.timestamp,
        feedId: feed.id,
      }

      // If the post already exists, it will be overwritten
      await store.storeThing(postToStore)
    }

    if (!newLastFetchTimestamp || (newPost.timestamp && newPost.timestamp > newLastFetchTimestamp)) {
      newLastFetchTimestamp = newPost.timestamp
    }
  }

  /** @type {Feed} */
  const feedToStore = {
    ...feed,
    lastFetchTimestamp: newLastFetchTimestamp,
  }
  await store.storeThing(feedToStore)
}

export default addNewPosts
