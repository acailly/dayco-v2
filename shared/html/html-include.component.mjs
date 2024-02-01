customElements.define(
  "html-include",
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const url = this.getAttribute("url");

      if (url) {
        fetch(url)
          .then((response) => response.text())
          .then((result) => {
            this.insertAdjacentHTML("afterend", result);
            this.remove();
          });
      }
    }
  }
);
