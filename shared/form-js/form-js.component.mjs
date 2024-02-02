if (!customElements.get('form-js')) {
  const NAVIGATE_EVENT = 'form-js:navigate'

  customElements.define(
    'form-js',
    class extends HTMLElement {
      constructor() {
        super()
      }

      connectedCallback() {
        const children = this.innerHTML

        const form = window.document.createElement('form')

        while (this.attributes.length) {
          const attribute = this.attributes.item(0)
          if (attribute) {
            form.setAttribute(attribute.name, attribute.value)
            this.removeAttribute(attribute.name)
          }
        }

        form.setAttribute('method', 'JS')
        form.innerHTML = children

        this.replaceChildren(form)

        this.listenFormSubmit(form)
      }

      /**
       * @param {HTMLFormElement} form
       */
      listenFormSubmit(form) {
        form.addEventListener(
          'submit',
          (event) => {
            const action = form.action

            event.preventDefault()

            import(action)
              .then((module) => {
                return Promise.resolve(module.default(form))
              })
              .then((href) => {
                if (href) {
                  // Send an event to pjax tools
                  const cancelled = !window.document.dispatchEvent(
                    new CustomEvent(NAVIGATE_EVENT, {
                      cancelable: true,
                      bubbles: true,
                      detail: {
                        href,
                      },
                    })
                  )
                  if (cancelled) {
                    return
                  }

                  window.location = href
                }
              })

            return false
          },
          true /* useCapture */
        )
      }
    }
  )
}
