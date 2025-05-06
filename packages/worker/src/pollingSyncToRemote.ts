import { get, set } from 'idb-keyval'
import { localDB } from '@penx/local-db'
import { api } from '@penx/trpc-client'
import { SessionData } from '@penx/types'
import { sleep } from '@penx/utils'

export async function pollingSyncToRemote() {
  let pollingInterval = 3 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    console.log('sync to remote')

    try {
      await sync()
    } catch (error) {
      console.log('======error:', error)
    }
    await sleep(pollingInterval)
  }
}

async function sync() {
  const session = (await get('SESSION')) as SessionData
  console.log('=======session polling:', session)

  if (!session || !session?.siteId) return

  const site = await localDB.site.where({ id: session.siteId }).first()

  if (!site) return

  const changes = await localDB.change
    .where({ siteId: session.siteId, synced: 0 })
    .sortBy('id')
  console.log('=======changes:', changes)

  for (const change of changes) {
    if (change.synced) continue

    const data = {
      operation: change.operation,
      table: change.table,
      siteId: change.siteId,
      key: change.key,
      data: change.data,
    }
    await api.sync.push.mutate(data)
    // await localDB.change.update(change.id, { synced: 1 })
    await localDB.change.delete(change.id)
  }
}
