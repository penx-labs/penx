import addressparser from 'addressparser'
import { ContentHandler } from '../content-handler'

export class SubstackHandler extends ContentHandler {
  constructor() {
    super()
    this.name = 'substack'
  }

  shouldPreParse(url: string, dom: Document): boolean {
    const host = this.name + '.com'
    const cdnHost = 'substackcdn.com'
    // check if url ends with substack.com
    // or has a profile image hosted at substack.com or substackcdn.com
    return (
      new URL(url).hostname.endsWith(host) ||
      !!dom
        .querySelector('.email-body img')
        ?.getAttribute('src')
        ?.includes(host || cdnHost)
    )
  }

  async preParse(url: string, dom: Document): Promise<Document> {
    const body = dom.querySelector('.email-body-container')

    // this removes header and profile avatar
    body?.querySelector('.header')?.remove()
    body?.querySelector('.preamble')?.remove()
    body?.querySelector('.meta-author-wrap')?.remove()
    // this removes meta button
    body?.querySelector('.post-meta')?.remove()
    // this removes footer
    body?.querySelector('.post-cta')?.remove()
    body?.querySelector('.container-border')?.remove()
    body?.querySelector('.footer')?.remove()
    // this removes the "restack" button
    body?.querySelector('.email-ufi-2-bottom')?.remove()
    // this removes the "share" button
    body?.querySelector('.email-ufi-2-top')?.remove()

    dom = this.fixupStaticTweets(dom)

    return Promise.resolve(dom)
  }

  findNewsletterHeaderHref(dom: Document): string | undefined {
    // Substack header links
    const postLink = dom.querySelector('h1 a')
    if (postLink) {
      return postLink.getAttribute('href') || undefined
    }

    return undefined
  }

  async isNewsletter({
    headers,
    dom,
  }: {
    from: string
    headers: Record<string, string | string[]>
    dom: Document
  }): Promise<boolean> {
    if (headers['list-post']) {
      return Promise.resolve(true)
    }
    // substack newsletter emails have tables with a *post-meta class
    if (dom.querySelector('table[class$="post-meta"]')) {
      return true
    }
    // If the article has a header link, and substack icons its probably a newsletter
    const href = this.findNewsletterHeaderHref(dom)
    const oldHeartIcon = dom.querySelector(
      'table tbody td span a img[src*="HeartIcon"]',
    )
    const oldRecommendIcon = dom.querySelector(
      'table tbody td span a img[src*="RecommendIconRounded"]',
    )
    const heartIcon = dom.querySelector('a img[src*="LucideHeart"]')
    const commentsIcon = dom.querySelector('a img[src*="LucideComments"]')
    return Promise.resolve(
      !!(
        href &&
        (oldHeartIcon || oldRecommendIcon || heartIcon || commentsIcon)
      ),
    )
  }

  async parseNewsletterUrl(
    headers: Record<string, string | string[]>,
    html: string,
  ): Promise<string | undefined> {
    // raw SubStack newsletter url is like <https://hongbo130.substack.com/p/tldr>
    // we need to get the real url from the raw url
    const postHeader = headers['list-post']?.toString()
    if (postHeader && addressparser(postHeader).length > 0) {
      return Promise.resolve(addressparser(postHeader)[0].name)
    }
    return this.findNewsletterUrl(html)
  }

  fixupStaticTweets(dom: Document): Document {
    const preClassName = '_dcode-static-'
    const staticTweets = dom.querySelectorAll('div[class="tweet static"]')

    if (staticTweets.length < 1) {
      return dom
    }

    const recurse = (node: Element, f: (node: Element) => void) => {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        recurse(child, f)
        f(child)
      }
    }

    for (const tweet of Array.from(staticTweets)) {
      tweet.className = preClassName + 'tweet'
      tweet.removeAttribute('style')

      // get all children, rename their class, remove style
      // elements (style will be handled in the reader)
      recurse(tweet, (n: Element) => {
        const className = n.className
        if (
          className.startsWith('tweet-') ||
          className.startsWith('quote-tweet')
        ) {
          n.className = preClassName + className
        }
        n.removeAttribute('style')
      })
    }

    return dom
  }
}
