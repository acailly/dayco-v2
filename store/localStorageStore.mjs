/** @typedef {import("../types.mjs").Type} Type  */
/** @typedef {import("../types.mjs").Thing} Thing  */

/**
 * @param {Type} type
 * @param {object} content
 */
const updateTypeStore = (type, content) => {
  window.localStorage.setItem(type, JSON.stringify(content))
}

/**
 * @param {Type} type
 * @returns {Object.<string, Thing>}
 */
const getTypeStore = (type) => {
  const localStorageContent = window.localStorage.getItem(type)
  let typeStore = localStorageContent ? JSON.parse(localStorageContent) : undefined
  if (!typeStore) {
    typeStore = {}
    updateTypeStore(type, typeStore)
  }

  return typeStore
}

/**
 * @param {Thing} thing
 */
export const storeThing = (thing) => {
  const { type, id } = thing

  const typeStore = getTypeStore(type)

  typeStore[id] = thing
  updateTypeStore(type, typeStore)
}

/**
 * @param {Type} type
 * @param {string} id
 * @returns {Thing | undefined}
 */
export const findThingById = (type, id) => {
  const typeStore = getTypeStore(type)

  if (typeStore) {
    return typeStore[id]
  }
}

/**
 * @param {Type} type
 * @returns {Thing[]}
 */
export const findAllThings = (type) => {
  const typeStore = getTypeStore(type)

  if (typeStore) {
    return Object.values(typeStore)
  }

  return []
}

/**
 * @param {Type} type
 * @param {string} id
 */
export const deleteThing = (type, id) => {
  const typeStore = getTypeStore(type)

  delete typeStore[id]

  updateTypeStore(type, typeStore)
}
