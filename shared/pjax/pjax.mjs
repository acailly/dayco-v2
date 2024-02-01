window.addEventListener("DOMContentLoaded", listenNavigationActions);

function listenNavigationActions() {
  listenClickOnLinks(onNavigationAction);
  listenPopstateEvents(onNavigationAction);
  listenFormSubmit(onNavigationAction);
  listenJSFormNavigationEvents(onNavigationAction);
}

/**
 * @param {(callback: string) => unknown} callback
 */
function listenClickOnLinks(callback) {
  // Inspired by old npm package "catch-links"
  // https://unpkg.com/browse/catch-links/index.js
  window.addEventListener("click", (event) => {
    // Ignore special cases
    {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.defaultPrevented
      ) {
        return true;
      }
    }

    // Find link
    /** @type {HTMLAnchorElement | null}*/
    let anchor = null;
    {
      /** @type {Node | null}*/
      let node;
      for (
        node = /** @type {Node?}*/ (event.target);
        node?.parentNode;
        node = node.parentNode
      ) {
        if (node.nodeName === "A") {
          anchor = /** @type {HTMLAnchorElement}*/ (node);
          break;
        }
      }
    }

    if (!anchor) {
      return true;
    }

    if (anchor.download) {
      return true;
    }

    const href = anchor.href;

    if (!href) {
      return true;
    }

    const url = new URL(href);
    if (url.host && url.host !== window.location.host) {
      return true;
    }

    event.preventDefault();

    callback(href);

    return false;
  });
}

/**
 * @param {(callback: string) => unknown} callback
 */
function listenPopstateEvents(callback) {
  window.addEventListener("popstate", () => {
    const href = window.location.href;
    callback(href);
  });
}

/**
 * @param {(callback: string) => unknown} callback
 */
function listenFormSubmit(callback) {
  window.addEventListener(
    "submit",
    (event) => {
      const form = /** @type {HTMLFormElement}*/ (event.target);

      const method = form.getAttribute("method") || form.method;
      if (method.toUpperCase() !== "GET") {
        return true;
      }

      // FIXME ignorer aussi les form avec onsubmit déclaré ???
      // FIXME ignorer aussi les form avec aucune action déclaré ???

      const action = form.action;

      const parsedURL = new URL(action);
      const formData = new FormData(form);
      // @ts-ignore haven't found a better way to convert FormData to URLSearchParams
      const queryParams = new URLSearchParams(formData);
      parsedURL.search = queryParams.toString();
      const href = parsedURL.href;

      event.preventDefault();

      callback(href);

      return false;
    },
    true /* useCapture */
  );
}

/**
 * @param {(callback: string) => unknown} callback
 */
function listenJSFormNavigationEvents(callback) {
  window.addEventListener("form-js:navigate", (event) => {
    const customEvent = /** @type {CustomEvent} */ (event);
    const href = customEvent.detail.href;

    event.preventDefault();

    callback(href);

    return false;
  });
}

const TRANSITION_DURATION_EXIT = 100;
const TRANSITION_DURATION_ENTER = 400;

/**
 * @param {string} href
 */
async function onNavigationAction(href) {
  const oldHref = window.location.href;
  const oldScrollY = window.scrollY;

  const targetPageHTML = await fetchTargetPageContent(href);

  const targetPageDOM = parseHTML(targetPageHTML);

  const containerInCurrentPage = getContainerToSwap(window.document);
  const containerInTargetPage = getContainerToSwap(targetPageDOM);

  await new Promise((resolve) => {
    const fadeOut = containerInCurrentPage.animate(
      {
        opacity: [1, 0],
      },
      TRANSITION_DURATION_EXIT
    );
    fadeOut.onfinish = resolve;
  });

  replaceContent(containerInCurrentPage, containerInTargetPage);

  const containerInNewPage = getContainerToSwap(window.document);

  const fadeIn = containerInNewPage.animate(
    {
      opacity: [0, 1],
    },
    TRANSITION_DURATION_ENTER
  );

  fadeIn.onfinish = () => {
    restoreScroll(oldHref, oldScrollY);
  };

  addNavigationToHistory(href);

  await executeScripts(containerInNewPage);
}

/**
 * @param {string} href
 * @returns {Promise<string>}
 */
async function fetchTargetPageContent(href) {
  const response = await window.fetch(href);
  const content = await response.text();
  return content;
}

/**
 * @param {string} html
 * @returns {Document}
 */
function parseHTML(html) {
  const dom = new DOMParser().parseFromString(html, "text/html");
  return dom;
}

/**
 * @param {Document} document
 * @returns {HTMLElement}
 */
function getContainerToSwap(document) {
  return document.body;
}

/**
 * @param {HTMLElement} swapFrom
 * @param {HTMLElement} swapTo
 */
function replaceContent(swapFrom, swapTo) {
  swapFrom.replaceWith(swapTo);
}

/**
 * @param {string} oldHref
 * @param {number} oldScrollY
 */
function restoreScroll(oldHref, oldScrollY) {
  if (oldHref === window.location.href) {
    window.scrollTo({ top: oldScrollY, left: 0, behavior: "smooth" });
  }
  // FIXME récupérer l'élément correspondant à ce qu'il y a après le #
  // https://github.com/swup/swup/blob/master/src/modules/getAnchorElement.ts
  // FIXME sinon, scrollToTop
  // https://github.com/swup/swup/blob/master/src/modules/scrollToContent.ts
}

/**
 * @param {string} href
 */
function addNavigationToHistory(href) {
  window.history.pushState({}, href, href);

  // FIXME gérer quand href est identique à la localisation actuelle : on ne fait rien ?
}

/**
 * @param {HTMLElement} container
 * @returns {Promise<void[]>}
 */
async function executeScripts(container) {
  const scriptNodes = findScriptNodes(container);
  return Promise.all(Array.from(scriptNodes).map(runScript));
}

/**
 * @param {HTMLElement} container
 * @returns {NodeListOf<HTMLScriptElement>}
 */
function findScriptNodes(container) {
  return container.querySelectorAll("script");
}

const PJAX_REFRESH_FLAG = "pjax-refresh";

/**
 * Make the browser run a script by cloning it and replacing the original by the clone
 *
 * @param {HTMLScriptElement} scriptNode
 * @returns {Promise<void>}
 */
async function runScript(scriptNode) {
  const clone = document.createElement("script");

  clone.innerHTML = scriptNode.innerHTML;

  const attributes = scriptNode.attributes;
  for (
    let attributeIndex = 0;
    attributeIndex < attributes.length;
    attributeIndex++
  ) {
    const attribute = attributes.item(attributeIndex);
    if (attribute) {
      // Special case for module scripts
      // As explained in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#other_differences_between_modules_and_standard_scripts
      // Module scripts are only evaluated once
      // To force evaluating them another time, we append a random number to their src URL
      if (scriptNode.type === "module" && attribute.name === "src") {
        const scriptSrcURL = new URL(scriptNode.src);
        const cloneScriptSrc = `${attribute.value}${
          scriptSrcURL.search ? "&" : "?"
        }${PJAX_REFRESH_FLAG}=${new Date().getTime().toString()}`;
        clone.setAttribute(
          attribute.name,
          attribute.value + "?pjax=" + new Date().getTime().toString()
        );
        continue;
      }

      clone.setAttribute(attribute.name, attribute.value);
    }
  }

  const promise = new Promise((resolve, reject) => {
    clone.onload = () => {
      resolve(true);
    };
    clone.onerror = reject;
  });

  scriptNode.replaceWith(clone);

  return promise;
}
