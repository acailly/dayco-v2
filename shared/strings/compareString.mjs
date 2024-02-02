/**
 * @param {string?} a
 * @param {string?} b
 * @returns {number}
 */
const compareString = (a, b) => {
  return a === b ? 0 : a == null ? -1 : b == null ? 1 : a.toString().localeCompare(b.toString())
}

export default compareString
