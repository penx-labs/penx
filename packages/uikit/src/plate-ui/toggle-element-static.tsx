import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { ChevronRight } from 'lucide-react'

export function ToggleElementStatic({
  children,
  className,
  ...props
}: SlateElementProps) {
  return (
    <SlateElement className={cn(className, 'pl-6')} {...props}>
      <div
        className="text-muted-foreground hover:bg-accent absolute -left-0.5 top-0 size-6 cursor-pointer select-none items-center justify-center rounded-md p-px transition-colors [&_svg]:size-4"
        contentEditable={false}
      >
        <ChevronRight
          className={cn('transition-transform duration-75', 'rotate-0')}
        />
      </div>
      {children}
    </SlateElement>
  )
}
