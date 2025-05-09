import { Pagination } from '@penx/components/Pagination'
// import { PostItem } from '@penx/components/PostItem'
import { Creation, PostListStyle, Site } from '@penx/types'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListProps {
  site: Site
  posts: Creation[]
  initialDisplayCreations?: Creation[]
  pagination?: PaginationProps
}

export function PostList({
  site,
  posts,
  initialDisplayCreations = [],
  pagination,
}: PostListProps) {
  const postListStyle =
    site.theme?.common?.creationListStyle ?? PostListStyle.SIMPLE
  const displayPosts =
    initialDisplayCreations.length > 0 ? initialDisplayCreations : posts

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-6">
        {/* {displayPosts.map((post) => {
          return (
            <PostItem
              key={post.slug}
              creation={post}
              postListStyle={postListStyle}
            />
          )
        })} */}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  )
}
