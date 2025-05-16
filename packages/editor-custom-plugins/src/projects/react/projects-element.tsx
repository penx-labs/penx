'use client'

import React from 'react'
// import { Link } from '@penx/libs/i18n'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'
import Link from 'next/link'
import { Button } from '@penx/uikit/button'

export const ProjectsElement = withRef<typeof PlateElement>((props, ref) => {
  const { children, className, ...rest } = props

  return (
    <PlateElement
      ref={ref}
      className={cn(className)}
      {...props}
    >
      <div className="bg-background border-foreground/5 text-foreground/60 flex h-20 items-center justify-center gap-2 rounded-2xl border p-4">
        <div>My Projects</div>
        <Link href="/~/settings/projects">
          <Button size="sm" variant="secondary">
            Edit
          </Button>
        </Link>
      </div>
      {children}
    </PlateElement>
  )
})
