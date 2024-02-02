import baseURL from '../baseURL/baseURL.mjs'
import html from '../html/html-tag.mjs'

if (!customElements.get('nav-bar')) {
  customElements.define(
    'nav-bar',
    class extends HTMLElement {
      constructor() {
        super()
      }

      connectedCallback() {
        this.innerHTML = html`<header>
          <span>⌚ Dayco</span>

          <nav>
            <a href="${baseURL}posts/">Publications</a>
            <a href="${baseURL}feeds/">Abonnements</a>
            <a href="${baseURL}backup/">Sauvegarde</a>
          </nav>
        </header>`
      }
    }
  )
}
