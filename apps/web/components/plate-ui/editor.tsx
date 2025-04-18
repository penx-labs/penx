'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import type { PlateContentProps } from '@udecode/plate/react'
import {
  PlateContent,
  useEditorContainerRef,
  useEditorRef,
} from '@udecode/plate/react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const editorContainerVariants = cva(
  'caret-primary select-text5 [&_.slate-selection-area]:border-brand/25 [&_.slate-selection-area]:bg-brand/15 relative w-full cursor-text overflow-y-auto focus-visible:outline-none [&_.slate-selection-area]:z-50 [&_.slate-selection-area]:border',
  // 'relative w-full cursor-text overflow-y-auto caret-primary select-text selection:bg-brand/25 focus-visible:outline-none [&_.slate-selection-area]:z-50 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-brand/25 [&_.slate-selection-area]:bg-brand/15',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        comment: cn(
          'flex flex-wrap justify-between gap-1 px-1 py-0.5 text-sm',
          'rounded-md border-[1.5px] border-transparent bg-transparent',
          'has-[[data-slate-editor]:focus]:border-brand/50 has-[[data-slate-editor]:focus]:ring-brand/30 has-[[data-slate-editor]:focus]:ring-2',
          'has-aria-disabled:border-input has-aria-disabled:bg-muted',
        ),
        default: 'h-full',
        demo: 'h-[650px]',
        select: cn(
          'border-input ring-offset-background focus-within:ring-ring group rounded-md border focus-within:ring-2 focus-within:ring-offset-2',
          'has-data-readonly:w-fit has-data-readonly:cursor-default has-data-readonly:border-transparent has-data-readonly:focus-within:[box-shadow:none]',
        ),
      },
    },
  },
)

export const EditorContainer = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof editorContainerVariants>) => {
  const editor = useEditorRef()
  const containerRef = useEditorContainerRef()

  return (
    <div
      id={editor.uid}
      ref={containerRef}
      className={cn(
        'ignore-click-outside/toolbar',
        editorContainerVariants({ variant }),
        className,
      )}
      {...props}
    />
  )
}

EditorContainer.displayName = 'EditorContainer'

export const editorVariants = cva(
  cn(
    'group/editor',
    'relative w-full cursor-text select-text overflow-x-hidden whitespace-pre-wrap break-words',
    'ring-offset-background rounded-md focus-visible:outline-none',
    'placeholder:text-muted-foreground/80 **:data-slate-placeholder:top-[auto_!important] **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!',
    '[&_strong]:font-bold',
  ),
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
      focused: {
        true: 'ring-ring ring-2 ring-offset-2',
      },
      variant: {
        note: {
          true: 'w-10',
        },
        ai: 'w-full px-0 text-base md:text-sm',
        aiChat:
          'max-h-[min(70vh,320px)] w-full max-w-[700px] overflow-y-auto px-3 py-2 text-base md:text-sm',
        comment: cn('rounded-none border-none bg-transparent text-sm'),
        default: 'size-full px-4 pt-3 text-base',
        post: 'size-full px-16 text-base sm:px-[max(10px,calc(50%-350px))]',
        fullWidth: 'size-full px-16 pb-72 pt-4 text-base sm:px-24',
        none: '',
        select: 'data-readonly:w-fit px-3 py-2 text-base',
      },
    },
  },
)

export type EditorProps = PlateContentProps &
  VariantProps<typeof editorVariants>

export const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  ({ className, disabled, focused, variant, ...props }, ref) => {
    return (
      <PlateContent
        ref={ref}
        className={cn(
          editorVariants({
            disabled,
            focused,
            variant,
          }),
          className,
        )}
        disabled={disabled}
        disableDefaultStyles
        {...props}
      />
    )
  },
)

Editor.displayName = 'Editor'
