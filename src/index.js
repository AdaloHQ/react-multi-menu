import React, { Component } from 'react'
import classNames from 'classnames'

// Positions are symbols to prevent hardcoding values.
// The only way to reference position is by directly importing.
export const TOP = Symbol('TOP')
export const TOP_LEFT = Symbol('TOP_LEFT')
export const TOP_RIGHT = Symbol('TOP_RIGHT')

export const BOTTOM = Symbol('BOTTOM')
export const BOTTOM_LEFT = Symbol('BOTTOM_LEFT')
export const BOTTOM_RIGHT = Symbol('BOTTOM_RIGHT')

export const DEFAULT_POSITION = BOTTOM

export const matches = (openPath, path) => {
  for (let i = 0; i < path.length; i += 1) {
    if (openPath[i] !== path[i]) {
      return false
    }
  }

  return true
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
      <div>
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
        <div className="multi-menu-item-label" title={data.label}>
          {data.label}
        </div>
        {open && hasChildren
          ? <div className="multi-menu-child">
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
