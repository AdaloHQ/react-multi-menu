import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import MultiMenu from '../src'
import '../styles.css'

const menuData = [
  { label: 'Item 1', value: 'item1' },
  { label: 'Item 2', value: 'item2' },
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

storiesOf('MultiMenu', module)
  .add('basic', () => (
    <MultiMenu
      menu={menuData}
    />
  ))
