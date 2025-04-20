import { ReactNode } from 'react'
import { PostPageWidget } from '@penx/components/theme-ui/PostPageWidget'
import { Creation, Site } from '@penx/types'

interface Props {
  site: Site
  creation: Creation
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostDetail(props: Props) {
  return <PostPageWidget {...props} titleClassName="" />
}
