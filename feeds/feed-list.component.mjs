import html from '../shared/html/html-tag.mjs'
import { FEED } from '../types.mjs'
import * as store from '../store/indexedDBStore.mjs'
import './feed-list-item.component.mjs'
import compareString from '../shared/strings/compareString.mjs'

/** @typedef {import("../types.mjs").Feed} Feed  */

customElements.define(
  'feed-list',
  class extends HTMLElement {
    constructor() {
      super()
    }

    connectedCallback() {
      store.findAllThings(FEED).then((things) => {
        const feeds = /** @type {Feed[]} */ (things)

        this.innerHTML = feeds
          .sort((feedA, feedB) => compareString(feedA.title, feedB.title))
          .map(
            (feed) => html`<feed-list-item id="${feed.id}" title="${feed.title}" url="${feed.url}"></feed-list-item>`
          )
          .join('\n')
      })
    }
  }
)
