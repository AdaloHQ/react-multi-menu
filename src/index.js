import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import DocumentEvents from 'react-document-events'

import { isDescendent } from './dom'

import {
  getMenuHeight,
  getMenuItemOffset,
  MENU_PAD,
  DEFAULT_ROW_HEIGHT,
} from './sizing'

const LEFT = 'left'
const RIGHT = 'right'
const EXPAND_UP = 'up'
const EXPAND_DOWN = 'down'
const ESC = 27

const LEFT_ARROW = 37
const UP_ARROW = 38
const RIGHT_ARROW = 39
const DOWN_ARROW = 40

const ARROWS = [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW]

const WINDOW_PAD = 16

export const matches = (openPath, path) => {
  for (let i = 0; i < path.length; i += 1) {
    if (openPath[i] !== path[i]) {
      return false
    }
  }

  return true
}

const stopPropagation = e => {
  e.preventDefault()
}

// Implements depth first search to find current value
const getByValue = (options, value, comparator = null) => {
  if (!comparator) {
    comparator = (a, b) => a === b
  }

  if (!options || typeof options !== 'object') {
    return undefined
  }

  for (let opt of options) {
    if (!opt || value === undefined || value === null) {
      continue
    }

    if (comparator(opt.value, value)) {
      return opt
    }

    if (opt.children) {
      let childResult = getByValue(opt.children, value, comparator)

      if (childResult) {
        return childResult
      }
    }
  }
}

export default class MultiSelectMenu extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  static defaultProps = {
    placeholder: 'Select...',
    options: [],
  }

  state = {
    expanded: false,
  }

  handleToggle = value => {
    this.setState({ expanded: value })
  }

  getLabel() {
    let { value, options, getLabel, placeholder, comparator } = this.props

    let label = null

    if (typeof options === 'function' && !getLabel) {
      console.error(
        'Warning: if options is a function, getLabel must also be provided'
      )
    }

    if (getLabel) {
      label = getLabel(value)
    } else if (Array.isArray(options)) {
      let selectedOption = getByValue(options, value, comparator)

      if (selectedOption) {
        label = selectedOption.label
      }
    }

    if (!label) {
      return (
        <span className="multi-select-menu-placeholder">{placeholder}</span>
      )
    }

    return label
  }

  renderTitle() {
    const { handleSearch, searchValue, searchPlaceholder } = this.props
    const { expanded } = this.state
    const label = this.getLabel()

    if (!handleSearch || (handleSearch && !expanded)) {
      return <span className="multi-select-menu-value">{label}</span>
    }

    return (
      <React.Fragment>
        <span className="multi-select-menu-expand-icon" />
        <input
          type="text"
          className="multi-select-menu-search"
          onChange={handleSearch}
          value={searchValue}
          ref={this.inputRef}
          placeholder={searchPlaceholder}
        />
      </React.Fragment>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { handleSearch } = this.props

    if (prevState.expanded !== this.state.expanded) {
      if (this.state.expanded && handleSearch) {
        this.inputRef.current.focus()
      }
    }
  }

  render() {
    let {
      className,
      menuClassName,
      dark,
      onChange,
      options,
      rowHeight,
      childWidth,
      menuTheme,
      label,
    } = this.props

    const title = typeof label === 'string' ? label : this.getLabel()

    return (
      <MultiMenuTrigger
        fitParent
        isStyledMenu
        className={classNames('multi-select-menu', className)}
        dark={dark}
        menu={options}
        onSelect={onChange}
        menuClassName={menuClassName}
        rowHeight={rowHeight}
        childWidth={childWidth}
        handleToggle={this.handleToggle}
        menuTheme={menuTheme}
      >
        <div className="multi-select-menu-selection" title={title}>
          {this.renderTitle()}
          <span className="multi-select-menu-expand-icon" />
        </div>
      </MultiMenuTrigger>
    )
  }
}

export class MultiMenuWrapper extends Component {
  static defaultProps = {
    expandDirection: RIGHT,
    verticalExpand: EXPAND_DOWN,
    rowHeight: DEFAULT_ROW_HEIGHT,
  }

  constructor(props) {
    super(props)

    this.state = {
      openPath: [],
    }
  }

  handleHover = openPath => {
    this.setState({ openPath })
  }

  handleKeyDown = e => {
    // Prevent arrow-triggered scrolling
    if (ARROWS.indexOf(e.which) >= 0) {
      e.preventDefault()
    }
  }

  render() {
    let {
      expandDirection,
      isSubMenu,
      menu,
      onSelect,
      position,
      isStyledMenu,
      className,
      verticalExpand,
      rowHeight,
      childWidth,
      closeMenu,
      menuTheme,
    } = this.props

    let { openPath } = this.state

    if (!position) {
      position = { top: WINDOW_PAD }
    }

    let maxHeight

    if (verticalExpand === EXPAND_UP) {
      maxHeight = window.innerHeight - position.bottom - WINDOW_PAD
    } else {
      maxHeight = window.innerHeight - position.top - WINDOW_PAD
    }

    return (
      <div
        className={classNames(
          'multi-menu-wrapper',
          `expand-${expandDirection}`,
          `expand-${verticalExpand}`,
          className,
          menuTheme,
          { 'multi-menu-wrapper-attached': isStyledMenu }
        )}
        style={position}
      >
        <DocumentEvents onKeyDown={this.handleKeyDown} />
        <MultiMenu
          {...{ isSubMenu, onSelect }}
          basePath={[]}
          menu={menu}
          openPath={openPath}
          width={position.width}
          onHover={this.handleHover}
          maxHeight={maxHeight}
          rowHeight={rowHeight}
          childWidth={childWidth}
          closeMenu={closeMenu}
        />
      </div>
    )
  }
}

export class MultiMenu extends Component {
  state = {
    overflowBefore: false,
    overflowAfter: false,
  }

  constructor(props) {
    super(props)
    this.evaluateMenu(props)
  }

  renderOpenMenu = () => {
    if (!this._el) {
      return null
    }

    let {
      basePath,
      openPath,
      onHover,
      onSelect,
      rowHeight,
      nested,
      childWidth,
      closeMenu,
    } = this.props

    let menu = this.getMenu()

    let openIndex

    if (matches(openPath, basePath)) {
      openIndex = openPath[basePath.length]
    }

    if (openIndex === undefined || nested) {
      return null
    }

    if (menu[openIndex] && menu[openIndex].inline) {
      return null
    }

    let openMenu = menu[openIndex] && menu[openIndex].children

    if (typeof openMenu === 'function') {
      openMenu = openMenu()
    }

    let windowHeight = window.innerHeight
    let scrollTop = this._el.scrollTop
    let offsetTop = this._el.getBoundingClientRect().top
    let calculatedHeight = getMenuHeight(openMenu, rowHeight)
    let currentItemOffset = getMenuItemOffset(menu, openIndex, rowHeight)
    let positionTop = currentItemOffset - scrollTop
    let currentOpenPath = basePath.concat([openIndex])
    let maxHeight = windowHeight - (offsetTop + positionTop) - WINDOW_PAD

    if (maxHeight < calculatedHeight) {
      let diff = calculatedHeight - maxHeight
      let maxDiff = windowHeight - maxHeight - 2 * WINDOW_PAD

      diff = Math.min(diff, maxDiff)

      maxHeight += diff
      positionTop -= diff - 8
    }

    return (
      <div
        className="multi-menu-child"
        onMouseOver={stopPropagation}
        onMouseDown={stopPropagation}
        onClick={stopPropagation}
        style={{ top: positionTop }}
      >
        <MultiMenu
          basePath={currentOpenPath}
          menu={openMenu}
          closeMenu={closeMenu}
          onHover={onHover}
          onSelect={onSelect}
          openPath={openPath}
          maxHeight={maxHeight}
          rowHeight={rowHeight}
          width={childWidth}
          childWidth={childWidth}
        />
      </div>
    )
  }

  handleScroll = e => {
    e.nativeEvent.stopImmediatePropagation()
    e.stopPropagation()

    this.setOverflow()
  }

  handleOverflowScroll = amount => {
    if (!this._el) {
      return
    }

    this._el.scrollTop += amount

    this.setOverflow()
  }

  menuRef = el => {
    this._el = el
  }

  setOverflow = () => {
    let { maxHeight, rowHeight } = this.props
    let menu = this.getMenu()
    let calculatedHeight = getMenuHeight(menu, rowHeight)

    if (!this._el) {
      return
    }

    let scrollOffset = this._el.scrollTop
    let overflowBefore = scrollOffset > 10
    let overflowAfter = calculatedHeight - scrollOffset > maxHeight + 10

    if (
      overflowBefore !== this.state.overflowBefore ||
      overflowAfter !== this.state.overflowAfter
    ) {
      this.setState({ overflowBefore, overflowAfter })
    }
  }

  componentDidMount() {
    this.setOverflow()
  }

  componentDidUpdate() {
    this.setOverflow()
  }

  evaluateMenuSub = (props = null, indent = 0) => {
    let { menu } = props || this.props

    if (typeof menu === 'function') {
      menu = menu()
    }

    let result = []

    for (let itm of menu) {
      if (itm && itm.children && itm.inline) {
        let parentItem = {
          ...itm,
          indent,
          children: null,
          subtitle: null,
        }

        let menu = itm.children

        result = result.concat(
          [parentItem].concat(this.evaluateMenuSub({ menu }, indent + 1))
        )
      } else {
        result.push(itm ? { ...itm, indent } : itm)
      }
    }

    return result
  }

  evaluateMenu = props => {
    this._evaluatedMenu = this.evaluateMenuSub(props)
  }

  getMenu = () => {
    return this._evaluatedMenu
  }

  shouldComponentUpdate(newProps) {
    if (newProps.menu !== this.props.menu) {
      this.evaluateMenu(newProps)
    }

    return true
  }

  render() {
    let {
      basePath,
      isSubMenu,
      onHover,
      onSelect,
      openPath,
      width,
      maxHeight,
      rowHeight,
      closeMenu,
    } = this.props

    let menu = this.getMenu()

    let { overflowBefore, overflowAfter } = this.state

    let styles = { width, maxHeight }

    return (
      <div className="multi-menu-inner-wrapper" style={styles}>
        <div
          className={classNames('multi-menu', {
            'multi-menu-overflow-before': overflowBefore,
            'multi-menu-overflow-after': overflowAfter,
          })}
          style={styles}
          onWheel={this.handleScroll}
        >
          <div
            className="multi-menu-scroll-container"
            style={styles}
            ref={this.menuRef}
          >
            {menu && menu.length > 0 ? (
              menu.map((itm, i) => (
                <MenuItem
                  key={i}
                  data={itm}
                  onHover={onHover}
                  onSelect={onSelect}
                  openPath={openPath}
                  path={basePath.concat([i])}
                  height={rowHeight}
                  closeMenu={closeMenu}
                />
              ))
            ) : (
              <div className="multi-menu-empty">Nothing Available</div>
            )}
          </div>
          {overflowBefore ? (
            <OverflowControl
              direction="up"
              onScroll={this.handleOverflowScroll}
            />
          ) : null}
          {overflowAfter ? (
            <OverflowControl
              direction="down"
              onScroll={this.handleOverflowScroll}
            />
          ) : null}
        </div>
        {this.renderOpenMenu()}
      </div>
    )
  }
}

export class OverflowControl extends Component {
  scrollAction = () => {
    let { direction, onScroll } = this.props
    let amount = direction === 'up' ? -6 : 6

    onScroll(amount)
  }

  handleMouseLeave = () => {
    window.clearInterval(this._timer)
  }

  handleMouseEnter = () => {
    this._timer = window.setInterval(this.scrollAction, 20)
  }

  componentWillUnmount() {
    this.handleMouseLeave()
  }

  render() {
    let { direction } = this.props

    return (
      <div
        className={classNames(
          'multi-menu-overflow',
          `multi-menu-overflow-${direction}`
        )}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="multi-menu-overflow-icon" />
      </div>
    )
  }
}

export const MenuSpacer = () => <div className="multi-menu-spacer" />

const getIcon = (icon, modifier) => {
  if (!icon) {
    return null
  }

  let iconBody

  switch (typeof icon) {
    // string name of the icon, for basic icons
    case 'string':
      iconBody = <span className={classNames('icon', `icon-${icon}`)} />
      break
    // boolean true, for empty icons
    // does not render an icon, but indents the label as though there was an icon before it
    case 'boolean':
      iconBody = ''
      break
    // JSX object, for more complicated/customized icons
    default:
      iconBody = icon
  }

  return (
    <div className={`multi-menu-item-icon multi-menu-item-icon--${modifier}`}>
      {iconBody}
    </div>
  )
}

export class MenuItem extends Component {
  handleClick = e => {
    let {
      data: { value, onClick, locked, type },
      onSelect,
      closeMenu,
    } = this.props

    if (onClick) {
      onClick(e)
    }

    if (!onSelect || (value === undefined && !onClick) || locked) {
      if (locked) closeMenu()
      return null
    }

    onSelect(value)
  }

  getChildren = () => {
    let { data } = this.props
    let { children } = data

    if (typeof children === 'function') {
      children = children()
    }

    return children || []
  }

  hasChildren = () => {
    let { data } = this.props
    let { children, inline } = data

    return children && this.getChildren().length > 0 && !inline
  }

  handleHover = e => {
    let { data, path, onHover } = this.props

    e.stopPropagation()

    if (data.disabled) {
      return
    }

    if (this.hasChildren()) {
      onHover(path)
    } else {
      onHover(path.slice(0, path.length - 1))
    }
  }

  render() {
    let { data, path, openPath, height } = this.props

    if (data === null) {
      return <MenuSpacer />
    }

    if (data.type === 'hidden') return null

    const { indent, inline, locked, hoverContent = 'upgrade' } = data

    const open = matches(openPath, path)

    const hasSubmenu = this.hasChildren()
    const clickAction = data.onClick

    const styles = {
      height,
      paddingLeft: 16 * (indent || 0),
    }

    // the value could be present but falsy; we need to strictly check for undefined
    const isClickable = data.value !== undefined || clickAction

    const childrenOnly = !isClickable && hasSubmenu
    const disabled = !isClickable && !hasSubmenu

    let title

    if (data.title) {
      title = data.title
    } else if (typeof data.label === 'string') {
      title = data.label
    }

    // Adds HTML data set properties
    const dataset = {}
    if (data.dataset) {
      for (const [key, value] of Object.entries(data.dataset)) {
        dataset[`data-${key}`] = value
      }
    }

    return (
      <div
        hovercontent={hoverContent}
        className={classNames(
          'multi-menu-item',
          {
            disabled,
            locked,
            open,
            inline,
            'has-children': hasSubmenu,
            'children-only': childrenOnly,
            'menu-option': isClickable,
          },
          data.className
        )}
        onMouseOver={this.handleHover}
        onClick={this.handleClick}
        style={styles}
        {...dataset}
      >
        <div
          className="multi-menu-item-label"
          title={title}
          style={data.styles}
        >
          {getIcon(data.icon, 'left')}
          <span className="multi-menu-item-label-text">{data.label}</span>
          {data.subtitle && !inline ? (
            <span className="multi-menu-item-subtitle">{data.subtitle}</span>
          ) : null}
        </div>
        {getIcon(data.rightIcon, 'right')}
      </div>
    )
  }
}

export class MultiMenuTrigger extends Component {
  state = {
    expanded: false,
    position: null,
    expandDirection: null,
    verticalExpand: EXPAND_DOWN,
  }

  getMenuWidth = () => {
    let { width } = this.props

    return width || 180
  }

  handleClick = e => {
    const { handleToggle } = this.props

    e.stopPropagation()
    e.preventDefault()

    if (this.state.expanded) {
      if (handleToggle) handleToggle(false)
      return this.setState({ expanded: false })
    }

    let { fitParent } = this.props
    let menuWidth = this.getMenuWidth()

    let position = this.state.position
    let expandDirection = RIGHT
    let verticalExpand = EXPAND_DOWN

    if (this.element) {
      let rect = this.element.getBoundingClientRect()
      let windowWidth = window.innerWidth
      let windowHeight = window.innerHeight

      let center = (rect.left + rect.right) / 2

      if (center * 2 > windowWidth) {
        expandDirection = LEFT
      }

      let verticalCenter = (rect.top + rect.bottom) / 2

      if (verticalCenter * 2 > windowHeight) {
        verticalExpand = EXPAND_UP
      }

      if (verticalExpand === EXPAND_UP) {
        position = {
          bottom: windowHeight - rect.top + MENU_PAD,
          width: menuWidth,
        }
      } else {
        position = { top: rect.bottom + MENU_PAD, width: menuWidth }
      }

      if (fitParent) {
        if (verticalExpand === EXPAND_UP) {
          position = {
            bottom: windowHeight - rect.top,
            left: rect.left,
            width: rect.width,
          }
        } else {
          position = { top: rect.bottom, left: rect.left, width: rect.width }
        }
      } else if (center - menuWidth / 2 < 20) {
        position.left = rect.left
      } else if (center + menuWidth / 2 > windowWidth - 20) {
        position.left = rect.right - menuWidth
      } else {
        position.left = center - menuWidth / 2
      }
    }

    this.setState(
      {
        position,
        expandDirection,
        verticalExpand,
        expanded: true,
      },
      () => {
        if (handleToggle) handleToggle(true)
      }
    )
  }

  handleSelect = val => {
    let { onSelect, handleToggle } = this.props

    this.setState({ expanded: false })
    if (handleToggle) handleToggle(false)

    if (onSelect) {
      onSelect(val)
    }
  }

  handleClickOutside = e => {
    const { handleToggle } = this.props

    if (isDescendent(e.target, this.element)) {
      return
    }

    this.setState({ expanded: false })
    if (handleToggle) handleToggle(false)
  }

  handleClose = () => {
    const { handleToggle } = this.props
    this.setState({ expanded: false })
    if (handleToggle) handleToggle(false)
  }

  handleKeyDown = e => {
    const { handleToggle } = this.props
    if (e.which === ESC) {
      this.setState({ expanded: false })
      if (handleToggle) handleToggle(false)
    }
  }

  handleBlur = () => {
    const { handleToggle } = this.props
    this.setState({ expanded: false })
    if (handleToggle) handleToggle(false)
  }

  elementRef = el => (this.element = el)

  componentDidMount() {
    window.addEventListener('blur', this.handleBlur)
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.handleBlur)
  }

  render() {
    let {
      children,
      className,
      menuClassName,
      dark,
      menu,
      isStyledMenu,
      rowHeight,
      childWidth,
      menuTheme,
    } = this.props

    let { expandDirection, expanded, position, verticalExpand } = this.state

    return (
      <div
        className={classNames(
          'multi-menu-trigger',
          className,
          `expand-${verticalExpand}`,
          { expanded, 'multi-menu-dark': dark }
        )}
        ref={this.elementRef}
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onDoubleClick={stopPropagation}
        onMouseUp={stopPropagation}
      >
        {expanded ? <DocumentEvents onKeyDown={this.handleKeyDown} /> : null}
        {expanded ? (
          <MenuPortal>
            <div
              className="multi-menu-trigger-close"
              onMouseDown={this.handleClose}
            />
            <MultiMenuWrapper
              isStyledMenu={isStyledMenu}
              expandDirection={expandDirection}
              verticalExpand={verticalExpand}
              menu={menu}
              onSelect={this.handleSelect}
              position={position}
              className={menuClassName}
              rowHeight={rowHeight}
              childWidth={childWidth}
              closeMenu={this.handleClose}
              menuTheme={menuTheme}
            />
          </MenuPortal>
        ) : null}
        <div
          className="multi-menu-trigger-element"
          onMouseDown={this.handleClick}
        >
          {children}
        </div>
      </div>
    )
  }
}

class MenuPortal extends Component {
  getNode() {
    if (!this._node) {
      this._node = document.createElement('div')
      this._node.className = 'multi-menu-container'
      document.body.appendChild(this._node)
    }

    return this._node
  }

  componentWillUnmount() {
    window.setTimeout(() => {
      // Remove node if exists
      if (!this._node) {
        return
      }

      document.body.removeChild(this._node)
      this._node = null
    }, 0)
  }

  render() {
    let { children } = this.props

    return ReactDOM.createPortal(
      <React.Fragment>{children}</React.Fragment>,
      this.getNode()
    )
  }
}
