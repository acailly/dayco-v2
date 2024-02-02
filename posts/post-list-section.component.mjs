import html from '../shared/html/html-tag.mjs'
import '../shared/form-js/form-js.component.mjs'

/** @typedef {import("../types.mjs").Post} Post  */
/** @typedef {import("../types.mjs").Feed} Feed  */

customElements.define(
  'post-list-section',
  class extends HTMLElement {
    static observedAttributes = ['count']

    constructor() {
      super()
    }

    getTitle() {
      const title = this.getAttribute('title')
      const count = this.getAttribute('count')

      return `${title} (${count})`
    }

    connectedCallback() {
      const feedId = this.getAttribute('feedId')

      const children = this.innerHTML

      this.innerHTML = html`<details>
        <summary>
          <h2>${this.getTitle()}</h2>
        </summary>
        <form-js action="deleteFeedPosts.mjs">
          <button type="submit">Marquer tout comme lu ✔️</button>
          <input type="hidden" name="feedId" value="${feedId}" />
        </form-js>
        ${children}
      </details>`
    }

    /**
     * @param {string} name
     */
    attributeChangedCallback(name) {
      if (name === 'count') {
        const titleElement = this.querySelector('h2')
        if (titleElement) {
          titleElement.textContent = this.getTitle()
        }
      }
    }
  }
)
