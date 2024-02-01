import html from "../shared/html/html-tag.mjs";
import "../shared/form-js/form-js.component.mjs";
import parseRssFeed from "./parseRssFeed.mjs";
import addNewPosts from "./addNewPosts.mjs";
import spinner from "../shared/spinner/spinner.mjs";

// In browser, use a CORS proxy
// From https://github.com/draftbit/twitter-lite/issues/41#issuecomment-467403918
const corsProxyURL = "https://acailly-cors-anywhere.onrender.com/";
// FIXME Pourquoi feedburner ne marche pas ? tester en direct ?
// par exemple : https://acailly-cors-anywhere.onrender.com/https://feeds2.feedburner.com/NoTechMagazine

customElements.define(
  "fetch-list-item",
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const title = this.getAttribute("title");
      const id = this.getAttribute("id");
      const url = this.getAttribute("url");

      if (!id) {
        return;
      }

      this.innerHTML = html`<span> ${title}</span>
        <span style="vertical-align: middle">${spinner}</span> `;

      fetch(`${corsProxyURL}${url}`)
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
          throw new Error(response.status + "" + response.statusText);
        })
        .then((text) => parseRssFeed(text))
        .then((posts) => {
          return addNewPosts(id, posts);
        })
        .then(() => {
          this.innerHTML = html`<span>${title} ✅</span>`;
        })
        .catch((error) => {
          this.innerHTML = html`
            <span>${title} ❌</span>
            <small>
              <details>
                <summary>Plus de détails sur l'erreur</summary>
                <a target="_blank" rel="noopener noreferrer" href="${url}"
                  >${url} ↗</a
                >
                <pre>${error}</pre>
              </details>
            </small>
          `;
        });
    }
  }
);
