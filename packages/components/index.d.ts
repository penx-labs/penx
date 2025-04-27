import { Site } from '@prisma/client'

declare global {
  interface Window {
    __SITE__: Site
    __SITE_ID__: string
    __USER_ID__: string
    __PLAYER__: any
  }
}
