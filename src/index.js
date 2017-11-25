import React, { Component } from 'react'
import classNames from 'classnames'

const LEFT = 'left'
const RIGHT = 'right'

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

export default class MultiMenuWrapper extends Component {
  static defaultProps = {
    expandDirection: RIGHT
  }

  constructor(props) {
    super(props)

    this.state = {
      openPath: []
    }
  }

  handleHover = openPath => {
    this.setState({ openPath })
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

    return (
      <div
        className={classNames(
          'multi-menu-wrapper',
          `expand-${expandDirection}`
        )}
        style={position}
      >
        <MultiMenu
          {...{ isSubMenu, onSelect }}
          basePath={[]}
          menu={menu}
          openPath={openPath}
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
    } = this.props

    return (
      <div className="multi-menu">
        {menu.map((itm, i) => (
          <MenuItem
            key={i}
            data={itm}
            onHover={onHover}
            onSelect={onSelect}
            openPath={openPath}
            path={basePath.concat([i])}
          />
        ))}
      </div>
    )
  }
}

export class MenuItem extends Component {
  handleClick = e => {
    let { data: { value }, onSelect } = this.props

    if (!onSelect) { return }

    onSelect(value)
  }

  handleHover = e => {
    let { path, onHover } = this.props

    e.stopPropagation()

    onHover(path)
  }

  render() {
    let { data, path, onHover, onSelect, openPath } = this.props

    let open = matches(openPath, path)
    let hasChildren = data.children && data.children.length > 0

    return (
      <div
        className={classNames(
          'multi-menu-item',
          { open, 'has-children': hasChildren }
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

      if (center - 90 < 20) {
        position.left = rect.left
      } else if (center + 90 > windowWidth - 20) {
        position.left = rect.right - 180
      } else {
        position.left = center - 90
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
    this.setState({ expanded: false })
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClickOutside)
  }

  elementRef = el => this.element = el

  render() {
    let { children, menu } = this.props
    let { expandDirection, expanded, position } = this.state

    return (
      <div
        className={classNames('multi-menu-trigger', { expanded })}
        onMouseDown={stopPropagation}
        ref={this.elementRef}
      >
        {expanded
          ? <MultiMenuWrapper
              expandDirection={expandDirection}
              menu={menu}
              onSelect={this.handleSelect}
              position={position}
            />
          : null}
        <div className="multi-menu-trigger-element" onClick={this.handleClick}>
          {children}
        </div>
      </div>
    )
  }
}
