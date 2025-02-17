import { ReactNode } from 'react'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { PostActions } from '@/components/theme-ui/PostActions'
import { SubscribeNewsletterCard } from '@/components/theme-ui/SubscribeNewsletter/SubscribeNewsletterCard'
import { Post, Site } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import Link from '../components/Link'
import { PostSubtitle } from '@/components/theme-ui/PostSubtitle'

interface LayoutProps {
  site: Site
  post: Post
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostDetail({ site, post, next, prev, className }: LayoutProps) {
  return (
    <div className={cn(className)}>
      <header className="space-y-4 pb-4">
        <div className="mb-4">
          <PageTitle className="mb-2">{post.title}</PageTitle>
          {post.description && <PostSubtitle>{post.description}</PostSubtitle>}
        </div>
        <div className="flex items-center justify-between">
          <dl className="flex items-center gap-2 text-foreground/50">
            <dt className="sr-only">Published on</dt>
            <dd className="text-base font-medium leading-6">
              <time>{formatDate(post.updatedAt)}</time>
            </dd>
            <dd>·</dd>
            <dd className="text-base font-medium leading-6">
              {post.readingTime.text}
            </dd>
          </dl>
        </div>

        <PostActions post={post} />
      </header>
      <div className="grid-rows-[auto_1fr]">
        <div className="prose max-w-none pb-8 dark:prose-invert">
          <ContentRender content={post.content} />
          <SubscribeNewsletterCard site={site} />
        </div>
        {post.cid && (
          <div className="text-foreground/60 text-xs rounded-md py-2 md:flex items-center gap-2 hidden">
            <span className="text-foreground/80">IPFS CID:</span>
            <span>{post.cid}</span>
            <a
              className="inline-flex"
              href={`https://ipfs-gateway.spaceprotocol.xyz/ipfs/${post.cid}`}
              target="_blank"
            >
              <ExternalLink className="cursor-pointer" size={12} />
            </a>
          </div>
        )}

        <footer>
          <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
            {prev && prev.path && (
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${prev.path}`}
                  className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
                  aria-label={`Previous post: ${prev.title}`}
                >
                  &larr; {prev.title}
                </Link>
              </div>
            )}
            {next && next.path && (
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${next.path}`}
                  className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
                  aria-label={`Next post: ${next.title}`}
                >
                  {next.title} &rarr;
                </Link>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
