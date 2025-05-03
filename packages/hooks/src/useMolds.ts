import { useAtomValue } from 'jotai'
import { moldsAtom } from '@penx/store'
import { CreationType } from '@penx/types'

export function useMolds() {
  const list = useAtomValue(moldsAtom)

  const sortKeys = [
    CreationType.PAGE,
    CreationType.NOTE,
    CreationType.TASK,
    CreationType.ARTICLE,
    CreationType.AUDIO,
    CreationType.IMAGE,
    CreationType.BOOKMARK,
    CreationType.FRIEND,
    CreationType.PROJECT,
  ]
  return {
    molds: list.sort((a, b) => {
      const indexA = sortKeys.indexOf(a.type as any)
      const indexB = sortKeys.indexOf(b.type as any)
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return 0
    }),
  }
}
