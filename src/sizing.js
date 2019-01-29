export const DEFAULT_ROW_HEIGHT = 26
export const SPACER_HEIGHT = 21
export const MENU_PAD = 8

export const getMenuHeight = (options, rowHeight) => {
  return getMenuItemOffset(options, options.length, rowHeight) + MENU_PAD
}

export const getMenuItemOffset = (options, index, rowHeight) => {
  let offset = MENU_PAD
  rowHeight = rowHeight || DEFAULT_ROW_HEIGHT

  for (let i = 0; i < index; i += 1) {
    let option = options[i]

    if (option && option.label) {
      offset += rowHeight

      if (option.children && option.inline) {
        offset += getMenuItemOffset(
          option.children,
          option.children.length,
          rowHeight
        )
      }
    } else {
      offset += SPACER_HEIGHT
    }
  }

  return offset
}
