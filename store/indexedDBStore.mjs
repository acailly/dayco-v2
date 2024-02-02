import { FEED, POST } from '../types.mjs'

/** @typedef {import("../types.mjs").Type} Type  */
/** @typedef {import("../types.mjs").Thing} Thing  */

const DATABASE_VERSION = 1
const DATABASE_NAME = 'dayco-rss-reader'
const DATABASE_STORES = [FEED, POST]

/**
 * @returns {Promise<IDBDatabase>}
 */
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    /**
     * @param {Event} event
     */
    request.onerror = (event) => {
      // @ts-ignore
      reject(event.target?.errorCode)
    }
    /**
     * @param {Event} event
     */
    request.onupgradeneeded = (event) => {
      /** @type IDBDatabase */
      // @ts-ignore
      const db = event.target.result

      DATABASE_STORES.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' })
        }
      })
    }
    /**
     * @param {Event} event
     */
    request.onsuccess = (event) => {
      /** @type IDBDatabase */
      // @ts-ignore
      const db = event.target?.result

      resolve(db)
    }
  })
}

/**
 * @param {string } type
 * @param {IDBTransactionMode } mode
 * @returns {Promise<IDBObjectStore>}
 */
const getTypeStore = (type, mode = 'readonly') => {
  return openDatabase().then((db) => {
    return db.transaction([type], mode).objectStore(type)
  })
}

/**
 * @template {Thing} T
 * @param {T} thing
 * @returns {Promise<unknown>}
 */
export const storeThing = (thing) => {
  const { type } = thing

  return getTypeStore(type, 'readwrite').then((typeStore) => {
    return new Promise((resolve) => {
      typeStore.put(thing).onsuccess = () => {
        resolve(true)
      }
    })
  })
}

/**
 * @param {Type} type
 * @param {string} id
 * @returns {Promise<Thing | undefined>}
 */
export const findThingById = (type, id) => {
  return getTypeStore(type).then((typeStore) => {
    return new Promise((resolve) => {
      typeStore.get(id).onsuccess = (event) => {
        /** @type Thing | undefined */
        // @ts-ignore
        const result = event.target?.result
        resolve(result)
      }
    })
  })
}

/**
 * @template {Thing} T
 * @param {Type} type
 * @returns {Promise<T[]>}
 */
export const findAllThings = (type) => {
  return getTypeStore(type).then((typeStore) => {
    return new Promise((resolve) => {
      typeStore.getAll().onsuccess = (event) => {
        /** @type T[] */
        // @ts-ignore
        const result = event.target?.result || []
        resolve(result)
      }
    })
  })
}

/**
 * @param {Type} type
 * @param {string} id
 * @returns {Promise<unknown>}
 */
export const deleteThing = (type, id) => {
  return getTypeStore(type, 'readwrite').then((typeStore) => {
    return new Promise((resolve) => {
      typeStore.delete(id).onsuccess = () => {
        resolve(true)
      }
    })
  })
}

/**
 * @returns {Promise<unknown>}
 */
export const deleteDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase(DATABASE_NAME)

    /**
     * @param {Event} event
     */
    request.onerror = (event) => {
      // @ts-ignore
      reject(event.target?.errorCode)
    }

    request.onsuccess = () => {
      resolve(undefined)
    }
  })
}
