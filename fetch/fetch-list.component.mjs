import html from '../shared/html/html-tag.mjs'
import { FEED } from '../types.mjs'
import * as store from '../store/indexedDBStore.mjs'
import './fetch-list-item.component.mjs'
import compareString from '../shared/strings/compareString.mjs'

/** @typedef {import("../types.mjs").Feed} Feed  */

if (!customElements.get('fetch-list')) {
  customElements.define(
    'fetch-list',
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
              (feed) =>
                html`<fetch-list-item id="${feed.id}" title="${feed.title}" url="${feed.url}"></fetch-list-item>`
            )
            .join('\n')
        })
      }
    }
  )
}
