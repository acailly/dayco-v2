/** @type {Object.<Type, Object.<string, Thing>>} */
const store = {};

/** @typedef {import("../types.mjs").Type} Type  */
/** @typedef {import("../types.mjs").Thing} Thing  */

/**
 * @param {Thing} thing
 */
export const storeThing = (thing) => {
  const { type, id } = thing;

  let typeStore = store[type];

  if (!typeStore) {
    store[type] = {};
    typeStore = store[type];
  }

  typeStore[id] = thing;
};

/**
 * @param {Type} type
 * @param {string} id
 * @returns {Thing | undefined}
 */
export const findThingById = (type, id) => {
  const typeStore = store[type];

  if (typeStore) {
    return typeStore[id];
  }
};

/**
 * @param {Type} type
 * @returns {Thing[]}
 */
export const findAllThings = (type) => {
  const typeStore = store[type];

  if (typeStore) {
    return Object.values(typeStore);
  }

  return [];
};
