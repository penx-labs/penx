import { PageTitle } from '@penx/components/PageTitle'
import { Creation, Site } from '@penx/types'
import { Trans } from '@lingui/react'
import { PostList } from '../components/PostList'

interface Props {
  site: Site
  posts: Creation[]
  initialDisplayCreations: Creation[]
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export function BlogPage({
  site,
  posts = [],
  pagination,
  initialDisplayCreations,
}: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle className="">
        <Trans id="Writings"></Trans>
      </PageTitle>
      <PostList
        site={site}
        posts={posts}
        pagination={pagination}
        initialDisplayCreations={initialDisplayCreations}
      />
    </div>
  )
}
