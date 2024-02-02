import { storeThing } from '../store/indexedDBStore.mjs'
import { FEED } from '../types.mjs'

/**
 * @param {HTMLFormElement} form
 */
const addFeed = (form) => {
  const data = new FormData(form)

  storeThing({
    type: FEED,
    id: Date.now().toString(),
    title: data.get('title'),
    url: data.get('url'),
  })

  // FIXME trouver un moyen plus clean tout en gérant la base url
  return window.location.href + '/../feeds'
}

export default addFeed
