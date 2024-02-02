import html from '../shared/html/html-tag.mjs'
import '../shared/form-js/form-js.component.mjs'

if (!customElements.get('feed-list-item')) {
  customElements.define(
    'feed-list-item',
    class extends HTMLElement {
      constructor() {
        super()
      }

      connectedCallback() {
        const title = this.getAttribute('title')
        const id = this.getAttribute('id')
        const url = this.getAttribute('url')

        this.innerHTML = html` <span>${title}</span>
          <button type="submit" form="form-delete-feed-${id}">Supprimer</button>
          <br />
          <a target="_blank" rel="noopener noreferrer" href="${url}">${url} ↗</a>
          <form-js action="deleteFeed.mjs" id="form-delete-feed-${id}">
            <input type="hidden" name="id" value="${id}" />
          </form-js>`
      }
    }
  )
}
