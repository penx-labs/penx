import React, { useMemo } from 'react'
import { BORDER_RADIUS, TRANSITIONS, WINDOW_TOP_OFFSET } from './constants'
import { useDrawerContext } from './context'
import {
  assignStyle,
  chain,
  getSafePaddingTop,
  isVertical,
  reset,
} from './helpers'

const noop = () => () => {}

export function useScaleBackground() {
  const {
    direction,
    isOpen,
    shouldScaleBackground,
    setBackgroundColorOnScale,
    noBodyStyles,
  } = useDrawerContext()
  const timeoutIdRef = React.useRef<number | null>(null)
  const initialBackgroundColor = useMemo(
    () => document.body.style.backgroundColor,
    [],
  )

  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth
  }

  React.useEffect(() => {
    if (isOpen && shouldScaleBackground) {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
      const wrapper =
        (document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement) ||
        (document.querySelector('[vaul-drawer-wrapper]') as HTMLElement)

      if (!wrapper) return

      chain(
        setBackgroundColorOnScale && !noBodyStyles
          ? assignStyle(document.body, { background: 'black' })
          : noop,
        assignStyle(wrapper, {
          transformOrigin: isVertical(direction) ? 'top' : 'left',
          transitionProperty: 'transform, border-radius',
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        }),
      )

      const safePadding = getSafePaddingTop()

      const wrapperStylesCleanup = assignStyle(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        ...(isVertical(direction)
          ? {
              transform: `scale(${getScale()}) translate3d(0, calc(${safePadding} + 14px), 0)`,
            }
          : {
              transform: `scale(${getScale()}) translate3d(${safePadding} + 14px), 0, 0)`,
            }),
      })

      return () => {
        wrapperStylesCleanup()
        timeoutIdRef.current = window.setTimeout(() => {
          if (initialBackgroundColor) {
            document.body.style.background = initialBackgroundColor
          } else {
            document.body.style.removeProperty('background')
          }
        }, TRANSITIONS.DURATION * 1000)
      }
    }
  }, [isOpen, shouldScaleBackground, initialBackgroundColor])
}
