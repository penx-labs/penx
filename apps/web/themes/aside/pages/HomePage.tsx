import { Trans } from '@lingui/react'
import { PageTitle } from '@penx/components/PageTitle'
import { HOME_PROJECT_LIMIT, LATEST_POSTS_LIMIT } from '@penx/constants'
import { ContentRender } from '@penx/content-render'
import { ProjectsBlock } from '@penx/editor-custom-plugins/projects/react/ProjectsBlock'
import { Link } from '@penx/libs/i18n'
import { Creation, PostListStyle, Project, Site, Tag } from '@penx/types'
import { PostItem } from '../components/PostItem'

interface Props {
  about: any
  tags: Tag[]
  site: Site
  creations: Creation[]
  projects: Project[]
}

export function HomePage({
  about,
  creations = [],
  projects,
  tags,
  site,
}: Props) {
  const { popularPosts, featuredPost, commonPosts } = extractPosts(creations)
  const showAbout = site.theme?.home?.showAbout ?? true
  const showLatestPosts = site.theme?.home?.showLatestCreations ?? true
  const showProjects = site.theme?.home?.showProjects ?? true
  const showsFeatured = site.theme?.home?.showFeatured ?? false
  const postListStyle =
    site.theme?.common?.creationListStyle ?? PostListStyle.SIMPLE
  return (
    <div className="mb-20 flex flex-col gap-16">
      {showAbout && <ContentRender content={about.content} />}

      <div className="">
        <div className="flex items-center justify-between pb-6 pt-6">
          <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
            <Trans id="Latest"></Trans>
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {!creations.length && <Trans id="No posts found."></Trans>}
          {creations.slice(0, LATEST_POSTS_LIMIT).map((post) => {
            return <PostItem key={post.slug} creation={post} />
          })}
        </div>
      </div>

      {showProjects && projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between pb-6 pt-6">
            <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
              <Trans id="Projects"></Trans>
            </h1>

            {projects.length > HOME_PROJECT_LIMIT && (
              <Link
                href="/projects"
                className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              >
                <Trans id="All projects"></Trans> &rarr;
              </Link>
            )}
          </div>
          <ProjectsBlock projects={projects.slice(0, HOME_PROJECT_LIMIT)} />
        </div>
      )}
    </div>
  )
}

function extractPosts(posts: Creation[]) {
  const popularPosts = posts.filter((post) => post.isPopular)
  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const ids = popularPosts.map((post) => post.id)
  if (featuredPost) ids.push(featuredPost.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPost,
    commonPosts,
  }
}
