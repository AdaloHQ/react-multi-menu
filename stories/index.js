import React, { Component } from 'react'
import deepEqual from 'deep-equal'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import MultiSelectMenu, { MultiMenuWrapper, MultiMenuTrigger } from '../src'
import '../styles.css'

const menuData = [
  { label: 'Item 1', value: 'item1' },
  { label: 'Item 2', value: 'item2', subtitle: 'Disabled', disabled: true },
  null,
  { label: 'Item 3', value: 'item3' },
  { label: 'Item with action', onClick: action('Click action') },
  {
    label: 'Item 4',
    value: 'item4',
    subtitle: 'With Children',
    children: [
      { label: 'Child 1 with a really long name', value: 'child1' },
      {
        label: 'Child 2',
        children: [
          { label: 'Sub-child 1', value: 'sc1' },
          { label: 'Sub-child 2', value: 'sc2' },
          { label: 'Sub-child 3', value: 'sc3' },
          { label: 'Sub-child 4', value: 'sc4' },
          { label: 'Sub-child 5', value: 'sc5' },
          { label: 'Sub-child 6', value: 'sc6' },
          { label: 'Sub-child 7', value: 'sc7' },
          { label: 'Sub-child 8', value: 'sc8' },
          { label: 'Sub-child 9', value: 'sc9' },
          { label: 'Sub-child 10', value: 'sc10' },
          { label: 'Sub-child 11', value: 'sc11' },
          { label: 'Sub-child 12', value: 'sc12' },
          { label: 'Sub-child 1', value: 'sc1' },
          { label: 'Sub-child 2', value: 'sc2' },
        ]
      }
    ]
  },
]

const styles = { display: 'flex', flexDirection: 'row' }

class MultiSelectWrapper extends Component {
  state = { value: null }

  handleChange = value => {
    this.props.onChange(value)
    this.setState({ value })
  }

  render() {
    let { value } = this.state

    return (
      <MultiSelectMenu
        {...this.props}
        value={value}
        onChange={this.handleChange}
      />
    )
  }
}

storiesOf('MultiMenuWrapper', module)
  .add('basic', () => (
    <MultiMenuWrapper
      menu={menuData}
      onSelect={action('Selected option')}
    />
  ))
  .add('no options', () => (
    <MultiMenuWrapper />
  ))

storiesOf('MultiSelectMenu', module)
  .add('full-width', () => (
    <MultiSelectWrapper
      className="test-select-menu"
      options={menuData}
      onChange={action('Change value')}
      placeholder="Select something from the list..."
    />
  ))
  .add('fixed-width wrapper', () => (
    <div style={{ width: 200 }}>
      <p>
        Hello, world!
        Here's some text. And a <a href="#">link</a>.
      </p>
      <MultiSelectWrapper
        options={menuData}
        onChange={action('Change value')}
      />
      <p>
        More text afterward to ensure proper formatting.
      </p>
    </div>
  ))
  .add('fixed-width, expanding-left', () => (
    <div style={{ width: 200, marginLeft: 'auto' }}>
      <MultiSelectWrapper
        options={menuData}
        onChange={action('Change value')}
      />
    </div>
  ))
  .add('with comparator', () => {
    let options = [
      { label: 'Option 1 (text)', value: 'hello' },
      { label: 'Option 2', value: { id: 2 } },
      { label: 'Option 3', value: { id: 3 } },
      { label: 'Same as Option 3', value: { id: 3 } },
      {
        label: 'Nested options',
        children: [
          { label: 'Option 4', value: { id: 4 } },
          { label: 'Option 3 again', value: { id: 3 } },
          { label: 'Text Option', value: 'Hello again?' },
        ]
      }
    ]

    return (
      <div style={{ width: 200 }}>
        <MultiSelectWrapper
          options={options}
          comparator={deepEqual}
          onChange={action('Change value')}
        />
      </div>
    )
  })
  .add('dark', () => (
    <div style={{ width: 200 }}>
      <MultiSelectWrapper
        dark
        options={menuData}
        onChange={action('Change value')}
      />
    </div>
  ))
  .add('with no options', () => (
    <div style={{ width: 200 }}>
      <MultiSelectWrapper placeholder="Nothing to select" />
    </div>
  ))

storiesOf('MultiMenuTrigger', module)
  .add('Aligned Left', () => (
    <div style={{ ...styles, justifyContent: 'flex-start' }}>
      <MultiMenuTrigger
        menu={menuData}
        onSelect={action('Selected option')}
      >
        Click Me
      </MultiMenuTrigger>
    </div>
  ))
  .add('Aligned Center', () => (
    <div style={{ ...styles, justifyContent: 'center' }}>
      <MultiMenuTrigger
        menu={menuData}
        onSelect={action('Selected option')}
      >
        Click Me
      </MultiMenuTrigger>
    </div>
  ))
  .add('Aligned Right', () => (
    <div style={{ ...styles, justifyContent: 'flex-end' }}>
      <MultiMenuTrigger
        menu={menuData}
        onSelect={action('Selected option')}
      >
        Click Me
      </MultiMenuTrigger>
    </div>
  ))
  .add('Aligned Center, Expand Left', () => (
    <div style={{ ...styles, justifyContent: 'center', marginLeft: 40 }}>
      <MultiMenuTrigger
        menu={menuData}
        onSelect={action('Selected option')}
      >
        Click Me
      </MultiMenuTrigger>
    </div>
  ))
  .add('Preventing scrolling', () => (
    <div>
      <div style={{ ...styles, justifyContent: 'center' }}>
        <MultiMenuTrigger
          menu={menuData}
          onSelect={action('Selected option')}
        >
          Click Me
        </MultiMenuTrigger>
      </div>
      <div style={{ height: 900, marginTop: 20, backgroundColor: '#faa' }} />
    </div>
  ))
  .add('Stops event propagation', () => (
    <a
      href="http://google.com"
      target="_blank"
      style={{
        background: '#ff0',
        padding: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}
      onClick={action('Clicked outside')}
    >
      <MultiMenuTrigger
        menu={menuData}
        onSelect={action('Selected option')}
      >
        Click Me
      </MultiMenuTrigger>
    </a>
  ))
  .add('Dark', () => (
    <div style={{ ...styles, justifyContent: 'center' }}>
      <MultiMenuTrigger
        dark
        menu={menuData}
        onSelect={action('Selected option')}
      >
        Click Me
      </MultiMenuTrigger>
    </div>
  ))


// ASYNC

storiesOf('MultiSelectMenu async', module)
  .add('Simple', () => {
    let getLabel = val => val && `Item #${val}`

    let getOptions = () => [
      {
        label: 'Item #1',
        value: 1,
        children: [
          { label: 'Item #2', value: 2 },
          { label: 'Item #3', value: 3 }
        ]
      }
    ]

    return (
      <div style={{ width: 200 }}>
        <MultiSelectWrapper
          className="test-select-menu"
          options={getOptions}
          getLabel={getLabel}
          onChange={action('Selected option')}
          placeholder="Select..."
        />
      </div>
    )
  })
  .add('Infinite', () => {
    let getLabel = val => val && `Item #${val}`

    let getOptions = () => {
      let value = 1

      return [
        {
          label: getLabel(value),
          value: value,
          children: getOptions
        }
      ]
    }

    return (
      <div style={{ width: 200 }}>
        <MultiSelectWrapper
          className="test-select-menu"
          options={getOptions}
          getLabel={getLabel}
          onChange={action('Selected option')}
          placeholder="Select..."
        />
      </div>
    )
  })

