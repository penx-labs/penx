'use client'

import { cn } from '@udecode/cn'
import type { SlateRenderElementProps } from '@udecode/plate'
import {
  useIndentTodoListElement,
  useIndentTodoListElementState,
} from '@udecode/plate-indent-list/react'
import { useReadOnly } from '@udecode/plate/react'
import { Checkbox } from './checkbox'

export const TodoMarker = ({
  element,
}: Omit<SlateRenderElementProps, 'children'>) => {
  const state = useIndentTodoListElementState({ element })
  const { checkboxProps } = useIndentTodoListElement(state)
  const readOnly = useReadOnly()

  return (
    <div contentEditable={false}>
      <Checkbox
        className={cn(
          'absolute -left-6 top-1',
          readOnly && 'pointer-events-none',
        )}
        {...checkboxProps}
      />
    </div>
  )
}

export const TodoLi = (props: SlateRenderElementProps) => {
  const { children, element } = props

  return (
    <li
      className={cn(
        'list-none',
        (element.checked as boolean) && 'text-muted-foreground line-through',
      )}
    >
      {children}
    </li>
  )
}
