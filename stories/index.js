import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import MultiMenu, { MultiMenuTrigger } from '../src'
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

storiesOf('MultiMenu', module)
  .add('basic', () => (
    <MultiMenu
      menu={menuData}
      onSelect={action('Selected option')}
    />
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
