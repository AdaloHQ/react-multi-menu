export const isDescendent = (childNode, parentNode) => {
  if (!childNode || !parentNode) { return false }

  for (let node = childNode; node; node = node.parentNode) {
    if (parentNode === node) {
      return true
    }
  }

  return false
}
