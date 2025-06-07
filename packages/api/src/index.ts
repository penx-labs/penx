import { get } from 'idb-keyval'
import _ky from 'ky'
import {
  isDesktop,
  isMobileApp,
  ROOT_HOST,
  TRANSCRIBE_URL,
} from '@penx/constants'

async function getHeaders() {
  if (isDesktop || isMobileApp) {
    const session = await get('SESSION')
    console.log('========session>>>>>:', session)
    if (session?.accessToken) {
      return {
        Authorization: `Bearer ${session.accessToken}`,
      }
    }
  }
  return {}
}

export const ky = _ky.extend({
  hooks: {
    beforeRequest: [
      async (request) => {
        const headers = await getHeaders()
        Object.entries(headers).forEach(([key, value]) => {
          request.headers.set(key, value)
        })
      },
    ],
  },
})

type SyncInput = {
  operation: any
  siteId: string
  key: string
  data: any
}
export const api = {
  async sync(input: SyncInput) {
    await ky
      .post(`${ROOT_HOST}/api/v1/sync`, {
        json: input,
      })
      .json()
  },

  async syncInitialNodes(nodes: any[]) {
    return ky
      .post(`${ROOT_HOST}/api/sync-initial-nodes`, {
        json: {
          nodes,
        },
      })
      .json<{ ok: boolean; existed: boolean; siteId: string }>()
  },

  async deleteAccount() {
    return ky.post(`${ROOT_HOST}/api/delete-account`).json()
  },

  async getSession() {
    return ky.get(`${ROOT_HOST}/api/session`).json()
  },

  async transcribe(file: File, duration: number, hash: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('duration', duration.toString())
    formData.append('hash', hash)
    return ky
      .post(TRANSCRIBE_URL, {
        body: formData,
      })
      .json<{ text: string }>()
  },
}
