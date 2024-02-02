import { showToast } from '../shared/toast/toast.component.mjs'
import { storeThing } from '../store/indexedDBStore.mjs'

/**@typedef {import('../types.mjs').Feed} Feed */

/**
 * @param {HTMLFormElement} form
 */
const restoreJsonFeeds = (form) => {
  const file = form['file'].files[0]
  const reader = new FileReader()
  reader.readAsText(file, 'UTF-8')
  reader.onload = function () {
    const content = reader.result
    if (content) {
      const feeds = /** @type {Feed[]} */ (JSON.parse(content.toString()))
      feeds.forEach((feed) => {
        storeThing(feed)
      })
    }
    showToast('Fichier JSON importé ✅')
    form.reset()
  }
  reader.onerror = function () {
    showToast(`Echec durant l'import du fichier JSON`)
    console.error(reader.error)
  }
}

export default restoreJsonFeeds
