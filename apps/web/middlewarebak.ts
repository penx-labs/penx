// import { getIronSession } from 'iron-session'
import Negotiator from 'negotiator'
import { NextRequest, NextResponse } from 'next/server'
import { locales } from '@penx/constants'
import { getSessionOptions } from '@penx/libs/session'
import { SessionData } from '@penx/types'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|images|_next/|_static/|_vercel|.well-known|[\\w-]+\\.\\w+).*)',
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const { pathname } = url

  if (pathname.endsWith('/creations/feed.xml')) {
    return NextResponse.rewrite(new URL('/creations/feed.xml', req.url))
  }

  if (pathname.endsWith('/podcasts/feed.xml')) {
    return NextResponse.rewrite(new URL('/podcasts/feed.xml', req.url))
  }

  if (pathname.endsWith('sitemap.xml')) {
    return NextResponse.rewrite(new URL('/sitemap.xml', req.url))
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:4000)
  let hostname = req.headers
    .get('host')!
    .replace('.localhost:4000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)

  const isRoot =
    hostname === 'localhost:4000' ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN

  // const token = await getToken({ req })
  // console.log('====token:', token)

  const requestLocale = getRequestLocale(req.headers)
  // console.log('======requestLocale:', requestLocale)

  const getLocale = () => {
    if (pathnameHasLocale) return pathname.split('/')[1]
    return isRoot ? requestLocale : 'pseudo'
  }

  const locale = getLocale()

  // req.nextUrl.pathname = `/${locale}${pathname}`

  const searchParams = req.nextUrl.searchParams.toString()
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)

  // console.log('=======searchParams:', searchParams, req.url, req.nextUrl)

  const postfix = searchParams.length > 0 ? `?${searchParams}` : ''

  const path = pathnameHasLocale
    ? `${url.pathname.replace(`/${locale}`, '')}${postfix}`
    : `${url.pathname}${postfix}`

  // Redirect if there is no locale

  // console.log(
  //   '======isRoot:',
  //   isRoot,
  //   'hostname:',
  //   hostname,
  //   process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  // )

  // console.log(
  //   '========pathnameHasLocale:',
  //   pathnameHasLocale,
  //   'locale:',
  //   locale,
  // )

  return NextResponse.rewrite(new URL(`/${locale}`, req.url))
}

function getRequestLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages(locales.slice())

  const activeLocale = languages[0] || locales[0] || 'en'

  return activeLocale
}
