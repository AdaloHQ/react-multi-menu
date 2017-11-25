import React, { Component } from 'react'
import classNames from 'classnames'

export const ALIGN_LEFT = 'align-left'
export const ALIGN_CENTER = 'align-center'
export const ALIGN_RIGHT = 'align-right'

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
    let { align, isSubMenu, menu, position, onSelect } = this.props
    let { openPath } = this.state

    return (
      <div className="multi-menu-wrapper">
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
  state = { expanded: false, align: null }

  handleClick = e => {
    if (this.state.expanded) {
      return this.setState({ expanded: false })
    }

    let align = this.state.align || ALIGN_CENTER

    if (this.element) {
      let rect = this.element.getBoundingClientRect()
      let windowWidth = window.innerWidth

      let center = (rect.left + rect.right) / 2

      if (center - 90 < 20) {
        align = ALIGN_LEFT
      } else if (center + 90 > windowWidth - 20) {
        align = ALIGN_RIGHT
      }
    }

    this.setState({ align, expanded: true })
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
    let { expanded, align } = this.state

    return (
      <div
        className={classNames('multi-menu-trigger', align, { expanded })}
        onMouseDown={stopPropagation}
        ref={this.elementRef}
      >
        {expanded
          ? <MultiMenuWrapper
              menu={menu}
              onSelect={this.handleSelect}
            />
          : null}
        <div className="multi-menu-trigger-element" onClick={this.handleClick}>
          {children}
        </div>
      </div>
    )
  }
}
