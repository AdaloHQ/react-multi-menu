import React, { Component } from 'react'
import classNames from 'classnames'
import DocumentEvents from 'react-document-events'

import { isDescendent } from './dom'

const LEFT = 'left'
const RIGHT = 'right'
const ESC = 27

const LEFT_ARROW = 37
const UP_ARROW = 38
const RIGHT_ARROW = 39
const DOWN_ARROW = 40

const ARROWS = [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW]

export const matches = (openPath, path) => {
  for (let i = 0; i < path.length; i += 1) {
    if (openPath[i] !== path[i]) {
      return false
    }
  }

  return true
}

const stopPropagation = e => {
  e.stopPropagation()
}

const getByValue = (options, value, comparator=null) => {
  if (!comparator) { comparator = (a, b) => a === b }

  if (!options) { return undefined }

  for (let opt of options) {
    if (!opt || !value) { continue }

    if (comparator(opt.value, value)) {
      return opt
    }

    if (opt.children) {
      let childResult = getByValue(opt.children, value)

      if (childResult) { return childResult }
    }
  }
}

export default class MultiSelectMenu extends Component {
  static defaultProps = {
    placeholder: 'Select...'
  }

  render() {
    let { comparator, dark, onChange, options, placeholder, value } = this.props

    let selectedOption = getByValue(options, value, comparator)

    let label = selectedOption
      ? selectedOption.label
      : <span className="multi-select-menu-placeholder">
          {placeholder}
        </span>

    return (
      <MultiMenuTrigger
        fitParent
        className="multi-select-menu"
        dark={dark}
        menu={options}
        onSelect={onChange}
      >
        <div className="multi-select-menu-selection">
          <span className="multi-select-menu-value">
            {label}
          </span>
          <span className="multi-select-menu-expand-icon" />
        </div>
      </MultiMenuTrigger>
    )
  }
}

export class MultiMenuWrapper extends Component {
  static defaultProps = {
    expandDirection: RIGHT
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

    if (e.which === UP_ARROW) {
      // console.log("GETTING PREVIOUS VALUE")
    } else if (e.which === DOWN_ARROW) {
      // console.log("GETTING NEXT VALUE")
    }

  }

  render() {
    let {
      align,
      expandDirection,
      isSubMenu,
      menu,
      onSelect,
      position
    } = this.props

    let { openPath } = this.state

    if (!position) { position = {} }

    return (
      <div
        className={classNames(
          'multi-menu-wrapper',
          `expand-${expandDirection}`
        )}
        style={position}
      >
        <DocumentEvents
          onKeyDown={this.handleKeyDown}
        />
        <MultiMenu
          {...{ isSubMenu, onSelect }}
          basePath={[]}
          menu={menu}
          openPath={openPath}
          width={position.width}
          onHover={this.handleHover}
        />
      </div>
    )
  }
}

export class MultiMenu extends Component {
  render() {
    let {
      basePath,
      isSubMenu,
      menu,
      onHover,
      onSelect,
      openPath,
      width,
    } = this.props

    let styles = { width }

    return (
      <div className="multi-menu" style={styles}>
        {menu && menu.length > 0
          ? menu.map((itm, i) => (
              <MenuItem
                key={i}
                data={itm}
                onHover={onHover}
                onSelect={onSelect}
                openPath={openPath}
                path={basePath.concat([i])}
              />
            ))
          : <div className="multi-menu-empty">Nothing Available</div>}
      </div>
    )
  }
}

export const MenuSpacer = () => (<div className="multi-menu-spacer" />)

export class MenuItem extends Component {
  handleClick = e => {
    let { data: { value }, onSelect } = this.props

    if (!onSelect) { return }

    onSelect(value)
  }

  handleHover = e => {
    let { data, path, onHover } = this.props

    e.stopPropagation()

    if (data.disabled) { return }

    if (data && data.children && data.children.length) {
      onHover(path)
    } else {
      onHover(path.slice(0, path.length - 1))
    }
  }

  render() {
    let { data, path, onHover, onSelect, openPath } = this.props

    if (data === null) {
      return <MenuSpacer />
    }

    let { disabled } = data

    let open = matches(openPath, path)
    let hasChildren = data.children && data.children.length > 0

    return (
      <div
        className={classNames(
          'multi-menu-item',
          { disabled, open, 'has-children': hasChildren }
        )}
        onMouseOver={this.handleHover}
      >
        <div
          className="multi-menu-item-label"
          onClick={this.handleClick}
          title={data.label}
        >
          {data.label}
        </div>
        {open && hasChildren
          ? <div
              className="multi-menu-child"
              onMouseOver={stopPropagation}
            >
              <MultiMenu
                basePath={path}
                menu={data.children}
                onHover={onHover}
                onSelect={onSelect}
                openPath={openPath}
              />
            </div>
          : null}
      </div>
    )
  }
}

export class MultiMenuTrigger extends Component {
  state = { expanded: false, position: null, expandDirection: null }

  handleClick = e => {
    if (this.state.expanded) {
      return this.setState({ expanded: false })
    }

    let { fitParent } = this.props

    let position = this.state.position
    let expandDirection = RIGHT

    if (this.element) {
      let rect = this.element.getBoundingClientRect()
      let windowWidth = window.innerWidth

      let center = (rect.left + rect.right) / 2

      if (center * 2 > windowWidth) {
        expandDirection = LEFT
      }

      position = { top: rect.bottom + 8 }
      let menuWidth = 180

      if (fitParent) {
        position = { top: rect.bottom, left: rect.left, width: rect.width }
      } else if (center - menuWidth / 2 < 20) {
        position.left = rect.left
      } else if (center + menuWidth / 2 > windowWidth - 20) {
        position.left = rect.right - menuWidth
      } else {
        position.left = center - menuWidth / 2
      }
    }

    this.setState({ position, expandDirection, expanded: true })
  }

  handleSelect = val => {
    let { onSelect } = this.props

    this.setState({ expanded: false })

    if (onSelect) {
      onSelect(val)
    }
  }

  handleClickOutside = e => {
    if (isDescendent(e.target, this.element)) { return }

    this.setState({ expanded: false })
  }

  handleClose = () => {
    this.setState({ expanded: false })
  }

  handleScroll = e => {
    e.preventDefault()
  }

  handleKeyDown = e => {
    if (e.which === ESC) {
      this.setState({ expanded: false })
    }
  }

  handleBlur = () => {
    this.setState({ expanded: false })
  }

  elementRef = el => this.element = el

  componentWillMount() {
    window.addEventListener('blur', this.handleBlur)
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.handleBlur)
  }

  render() {
    let { children, className, dark, menu } = this.props
    let { expandDirection, expanded, position } = this.state

    return (
      <div
        className={classNames(
          'multi-menu-trigger',
          className,
          { expanded, 'multi-menu-dark': dark }
        )}
        ref={this.elementRef}
      >
        {expanded
          ? <div
              className="multi-menu-trigger-close"
              onMouseDown={this.handleClose}
            />
          : null}
        {expanded
          ? <DocumentEvents
              onMouseDown={this.handleClickOutside}
              onWheel={this.handleScroll}
              onKeyDown={this.handleKeyDown}
            />
          : null}
        {expanded
          ? <MultiMenuWrapper
              expandDirection={expandDirection}
              menu={menu}
              onSelect={this.handleSelect}
              position={position}
            />
          : null}
        <div className="multi-menu-trigger-element" onMouseDown={this.handleClick}>
          {children}
        </div>
      </div>
    )
  }
}
