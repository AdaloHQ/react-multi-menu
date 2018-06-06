const ROW_HEIGHT = 26
const SPACER_HEIGHT = 21
const MENU_PAD = 8

export const getMenuHeight = options => {
  return getMenuItemOffset(options, options.length) + MENU_PAD
}

export const getMenuItemOffset = (options, index) => {
  let offset = MENU_PAD

  for (let i = 0; i < index; i += 1) {
    let option = options[i]

    if (option && option.label) {
      offset += ROW_HEIGHT
    } else {
      offset += SPACER_HEIGHT
    }
  }

  return offset
}
