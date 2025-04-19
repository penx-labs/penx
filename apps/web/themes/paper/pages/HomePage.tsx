import { ProjectsBlock } from '@penx/uikit/editor/custom-plate-plugins/projects/react/ProjectsBlock'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { HOME_PROJECT_LIMIT, LATEST_POSTS_LIMIT } from '@penx/constants'
import { Link } from '@/lib/i18n'
import { Creation, PostListStyle, Project, Site, Tag } from '@penx/types'
import { Trans } from '@lingui/react/macro'
import { PostItem } from '../components/PostItem'

interface Props {
  about: any
  tags: Tag[]
  site: Site
  posts: Creation[]
  projects: Project[]
}

export function HomePage({ about, posts = [], projects, tags, site }: Props) {
  const showAbout = site.theme?.home?.showAbout ?? true
  const showLatestPosts = site.theme?.home?.showLatestCreations ?? true
  const showProjects = site.theme?.home?.showProjects ?? true
  const showsFeatured = site.theme?.home?.showFeatured ?? false
  const postListStyle =
    site.theme?.common?.creationListStyle ?? PostListStyle.SIMPLE
  return (
    <div className="flex flex-col gap-16">
      {showAbout && <ContentRender content={about.content} />}

      <div className="">
        <div className="flex items-center justify-between pb-6 pt-6">
          <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
            <Trans>Latest</Trans>
          </h1>

          {posts.length > LATEST_POSTS_LIMIT && (
            <Link
              href="/posts"
              className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
            >
              All posts &rarr;
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3">
          {!posts.length && <Trans>No posts found.</Trans>}
          {posts.slice(0, LATEST_POSTS_LIMIT).map((post) => {
            return <PostItem key={post.slug} creation={post} />
          })}
        </div>
      </div>

      {showProjects && projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between pb-6 pt-6">
            <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
              Projects
            </h1>

            {projects.length > HOME_PROJECT_LIMIT && (
              <Link
                href="/projects"
                className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              >
                All projects &rarr;
              </Link>
            )}
          </div>
          <ProjectsBlock projects={projects.slice(0, HOME_PROJECT_LIMIT)} />
        </div>
      )}
    </div>
  )
}
