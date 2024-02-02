import html from '../shared/html/html-tag.mjs'
import { FEED, POST } from '../types.mjs'
import * as store from '../store/indexedDBStore.mjs'
import './post-list-section.component.mjs'
import './post-list-item.component.mjs'
import compareString from '../shared/strings/compareString.mjs'
import spinner from '../shared/spinner/spinner.mjs'

/** @typedef {import("../types.mjs").Post} Post  */
/** @typedef {import("../types.mjs").Feed} Feed  */

if (!customElements.get('post-list')) {
  customElements.define(
    'post-list',
    class extends HTMLElement {
      constructor() {
        super()
      }

      connectedCallback() {
        this.innerHTML = html`<span>Chargement... ${spinner}</span>`

        // FIXME là ca bloque le rendu à tel point que la navbar ne s'affiche pas
        store.findAllThings(POST).then((things) => {
          // Get all posts
          const posts = /**@type { Post[] }*/ (things)

          // Sort them by feed

          /** @type {Object.<string, Post[]>} */
          const postsByFeed = {}
          posts.forEach((post) => {
            const feedId = post.feedId
            let feedPosts = postsByFeed[feedId]
            if (!feedPosts) {
              feedPosts = []
              postsByFeed[feedId] = feedPosts
            }
            feedPosts.push(post)
          })

          store.findAllThings(FEED).then((things) => {
            this.innerHTML = ''

            // Display posts of each feed
            const feeds = /** @type {Feed[]} */ (things)
            feeds
              .sort((feedA, feedB) => compareString(feedA.title, feedB.title))
              .forEach((feed) => {
                const feedPosts = renderFeedPosts(feed, postsByFeed)
                this.insertAdjacentHTML('beforeend', feedPosts)
              })
          })
        })
      }
    }
  )
}

/**
 * Display all posts of one feed
 *
 * @param {Feed} feed
 * @param {Object.<string, Post[]>} postsByFeed
 * @returns {string}
 */
function renderFeedPosts(feed, postsByFeed) {
  let result = ''

  const feedPosts = postsByFeed[feed.id]
  if (feedPosts && feedPosts.length) {
    result += html`<post-list-section title="${feed.title}" feedId="${feed.id}" count="${feedPosts.length}">
      ${feedPosts
        .sort((postA, postB) => postA.timestamp - postB.timestamp)
        .map(
          (post) =>
            html`<post-list-item
              id="${post.id}"
              title="${post.title}"
              url="${post.url}"
              date="${new Date(post.timestamp).toLocaleDateString()}"
            ></post-list-item>`
        )
        .join('\n')}
    </post-list-section>`
  }

  return result
}
