'use client'

import React, { forwardRef, useState } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Trans } from '@lingui/react'
import { produce } from 'immer'
import {
  ChevronRightIcon,
  Maximize2Icon,
  MaximizeIcon,
  XIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useArea } from '@penx/hooks/useArea'
import { useMolds } from '@penx/hooks/useMolds'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'
import { WidgetName } from '@penx/widgets/WidgetName'
import { IsAllProvider } from './IsAllContext'
import { WidgetRender } from './WidgetRender'

// import { IsAllProvider } from './IsAllContext'
// import { MenuPopover } from './MenuPopover'

interface Props {
  index?: number

  style?: any

  widget: Widget
}

export const Item = forwardRef<HTMLDivElement, Props>(
  function Item(props, ref) {
    const { molds } = useMolds()
    const [visible, setVisible] = useState(false)
    const { area } = useArea()
    const [widget, setWidget] = useState(props.widget)

    if (!widget) return null

    return (
      <>
        <AnimatePresence initial={false}>
          {visible && (
            <motion.div
              initial={{ left: -240 }}
              animate={{ left: 8 }}
              exit={{ left: -240 }}
              className="bg-background border-foreground/10 fixed left-[8px] top-[10vh] z-50 flex h-[80vh] w-[240px] flex-col rounded-xl border shadow-xl"
            >
              <div className="flex items-center justify-between gap-1 px-3 py-2">
                <div className="select-none text-sm font-semibold">
                  <WidgetName widget={widget} molds={molds} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 rounded-md"
                  onClick={() => {
                    setVisible(false)
                  }}
                >
                  <XIcon size={16} className="text-foreground/60"></XIcon>
                </Button>
              </div>

              <div className="flex-1 overflow-auto">
                <IsAllProvider isAll>
                  <WidgetRender widget={widget} />
                </IsAllProvider>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          ref={ref}
          className={cn('bg-background group/widget flex flex-col rounded-md')}
        >
          <div
            className="flex h-10 cursor-pointer items-center gap-0.5"
            onClick={() => {
              setVisible(!visible)
            }}
          >
            <motion.div
              initial="closed"
              variants={{
                open: {
                  rotate: 90,
                  transition: {
                    duration: 0.2,
                  },
                },
                closed: {
                  rotate: 0,
                  transition: {
                    duration: 0.2,
                  },
                },
              }}
              animate={widget.collapsed ? 'closed' : 'open'}
              className="hover:bg-foreground/5 size-5 rounded-md"
              onClick={(e) => {
                e.stopPropagation()
                const newWidget = produce(widget, (draft) => {
                  draft.collapsed = !draft.collapsed
                })

                setWidget(newWidget)
              }}
            >
              <ChevronRightIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
            </motion.div>

            <div className="inline-flex h-full select-none items-center text-sm font-semibold leading-none">
              <WidgetName widget={widget} molds={molds} />
            </div>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="group/maximize size-6"
              >
                <MaximizeIcon
                  size={14}
                  className="text-foreground/40 group-hover/maximize:text-foreground/70"
                />
              </Button>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {!widget.collapsed ? (
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
              >
                {/* <IsAllProvider>
                </IsAllProvider> */}

                <WidgetRender widget={widget} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </>
    )
  },
)
