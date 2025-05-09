'use client'

import {
  FireLiComponent,
  FireMarker,
} from '@penx/editor-plugins/plate-ui/indent-fire-marker'
import { TodoLi, TodoMarker } from '@penx/editor-plugins/plate-ui/indent-todo-marker'
import { BlockquotePlugin } from '@udecode/plate-block-quote/react'
import { CodeBlockPlugin } from '@udecode/plate-code-block/react'
import { HEADING_LEVELS } from '@udecode/plate-heading'
import { IndentListPlugin } from '@udecode/plate-indent-list/react'
import { IndentPlugin } from '@udecode/plate-indent/react'
import { TogglePlugin } from '@udecode/plate-toggle/react'
import { ParagraphPlugin } from '@udecode/plate/react'

export const indentListPlugins = [
  IndentPlugin.extend({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        BlockquotePlugin.key,
        CodeBlockPlugin.key,
        TogglePlugin.key,
      ],
    },
  }),
  IndentListPlugin.extend({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        BlockquotePlugin.key,
        CodeBlockPlugin.key,
        TogglePlugin.key,
      ],
    },
    options: {
      listStyleTypes: {
        fire: {
          liComponent: FireLiComponent,
          markerComponent: FireMarker,
          type: 'fire',
        },
        todo: {
          liComponent: TodoLi,
          markerComponent: TodoMarker,
          type: 'todo',
        },
      },
    },
  }),
]
