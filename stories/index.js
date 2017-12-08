import React, { Component } from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import MultiSelectMenu, { MultiMenuWrapper, MultiMenuTrigger } from '../src'
import '../styles.css'

const menuData = [
  { label: 'Item 1', value: 'item1' },
  { label: 'Item 2', value: 'item2' },
  null,
  { label: 'Item 3', value: 'item3' },
  {
    label: 'Item 4',
    value: 'item4',
    children: [
      { label: 'Child 1 with a really long name', value: 'child1' },
      {
        label: 'Child 2',
        value: 'child2',
        children: [
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
  .add('flex wrapper', () => (
    <div style={{ ...styles, justifyContent: 'center' }}>
      <MultiSelectWrapper
        options={menuData}
        onChange={action('Change value')}
      />
    </div>
  ))
  .add('with comparator', () => {
    let options = [
      { label: 'Option 1', value: { id: 1 } },
      { label: 'Option 2', value: { id: 2 } },
      { label: 'Option 3', value: { id: 3 } },
      { label: 'Same as Option 3', value: { id: 3 } },
    ]

    return (
      <div style={{ width: 200 }}>
        <MultiSelectWrapper
          options={options}
          comparator={(val1, val2) => val1.id === val2.id}
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
