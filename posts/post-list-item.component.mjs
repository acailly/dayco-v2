import html from '../shared/html/html-tag.mjs'
import '../shared/form-js/form-js.component.mjs'

customElements.define(
  'post-list-item',
  class extends HTMLElement {
    constructor() {
      super()
    }

    connectedCallback() {
      const title = this.getAttribute('title')
      const id = this.getAttribute('id')
      const url = this.getAttribute('url')
      const date = this.getAttribute('date')

      this.innerHTML = html`
        <span>${title}</span>
        <button type="submit" form="form-delete-post-${id}">Lu ✔️</button>
        <br />
        <small>${date}</small>
        <br />
        <a target="_blank" rel="noopener noreferrer" href="${url}">${url} ↗</a>
        <form-js action="/dayco-v2/posts/deletePost.mjs" id="form-delete-post-${id}">
          <input type="hidden" name="id" value="${id}" />
        </form-js>
      `
    }
  }
)
