import { deleteThing } from '../store/indexedDBStore.mjs'
import { POST } from '../types.mjs'

/**
 * @param {HTMLFormElement} form
 */
const deletePost = (form) => {
  const data = new FormData(form)
  const id = data.get('id')?.toString()

  if (id) {
    deleteThing(POST, id)
  }

  // Remove list item
  const listItem = form.closest('post-list-item')
  if (listItem && listItem.firstElementChild) {
    const currentHeight = listItem.firstElementChild.getBoundingClientRect().height
    const fadeOut = listItem.firstElementChild.animate(
      {
        opacity: [1, 0.2, 0],
        height: [`${currentHeight}px`, '0px', '0px'],
        margin: 0,
      },
      {
        duration: 200,
      }
    )
    fadeOut.onfinish = () => listItem.remove()
  }

  // Update section item count
  const section = form.closest('post-list-section')
  if (section) {
    const currentCount = parseInt(section.getAttribute('count') || '1', 10)
    const newCount = currentCount - 1
    if (newCount === 0) {
      section.remove()
    } else {
      section.setAttribute('count', newCount.toString())
    }
  }
}

export default deletePost
