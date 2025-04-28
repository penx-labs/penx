'use client'

import isEqual from 'react-fast-compare'
import {
  ChangeMessage,
  isChangeMessage,
  isControlMessage,
  Message,
  Row,
  Shape,
  ShapeStream,
  ShapeStreamOptions,
} from '@electric-sql/client'
import { SHAPE_URL } from '@penx/constants'
import { refetchCreations } from '@penx/hooks/useCreations'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { isRowsEqual } from './isRowsEqual'
import { getElectricSyncState, setElectricSyncState } from './syncState'

export async function syncCreationsToLocal(siteId: string) {
  const { last_lsn, ...metadata } = await getElectricSyncState('creation')
  // console.log('========syncState:', metadata, 'last_lsn:', last_lsn)

  console.log('===========SHAPE_URL:', SHAPE_URL)

  const stream = new ShapeStream({
    url: SHAPE_URL,
    params: {
      table: 'creation',
      where: `"siteId" = '${siteId}'`,
    },
    ...metadata,
  })

  stream.subscribe(async (messages) => {
    // console.log('=======>>>>>>messages:', messages)

    const { changes, lsn } = handleMessages(messages)

    // console.log('========changes:', changes, 'lsn:', lsn)
    if (!changes.length) return
    const state = await getElectricSyncState('creation')

    if (lsn && state?.last_lsn && BigInt(lsn) <= BigInt(state.last_lsn)) {
      console.log(
        'no need to sync, skipping...',
        'lsn:',
        lsn,
        'state.last_lsn:',
        state.last_lsn,
      )
      return
    }

    try {
      let updated = false
      await localDB.transaction('rw', localDB.creation, async () => {
        const creations = await localDB.creation.where({ siteId }).toArray()
        for (const message of changes) {
          const value = message.value as any
          const operation = message.headers.operation
          if (operation === 'insert') {
            // console.log('insert:', message)
            await localDB.creation.put(value)
            updated = true // TODO:
          }
          if (operation === 'update') {
            // console.log('update:', message)
            const creation = creations.find((c) => c.id === value.id)
            if (!creation) continue
            const changed = Object.keys(value)
              .filter((k) => k !== 'updatedAt')
              .some((key) => {
                // console.log('=====value[key]:', value[key], creation[key])
                return !isEqual(value[key], (creation as any)[key])
              })

            if (changed) {
              await localDB.creation.update(value.id, value)
              updated = true
            }
          }
          if (operation === 'delete') {
            // console.log('message delete:', message)
            await localDB.creation.delete(value.id)
            updated = true // TODO:
          }
        }
      })

      console.log('synced:', updated)

      await setElectricSyncState('creation', {
        handle: stream.shapeHandle!,
        offset: stream.lastOffset,
        last_lsn: lsn,
      })

      if (updated) {
        refetchCreations()
      }
    } catch (error) {
      console.error(error)
    }
  })
}

function handleMessages(messages: Message<Row<never>>[], debug = true) {
  let lsn: string = ''
  let changes: ChangeMessage[] = []
  for (const message of messages) {
    if (isChangeMessage(message)) {
      changes.push(message)
    } else if (isControlMessage(message)) {
      switch (message.headers.control) {
        case 'up-to-date': {
          if (debug) {
            console.log('received up-to-date', message)
          }
          if (typeof message.headers.global_last_seen_lsn !== `string`) {
            throw new Error(`global_last_seen_lsn is not a string`)
          }
          // const globalLastSeenLsn = BigInt(
          //   message.headers.global_last_seen_lsn,
          // if (globalLastSeenLsn <= lastCommittedLsnForShape) {
          //   // We are replaying changes / have already seen this lsn
          //   // skip and move on to the next message
          //   return
          // }
          lsn = message.headers.global_last_seen_lsn
          break
        }
        case 'must-refetch': {
          // Reset the changes for this shape
          if (debug) {
            console.log('received must-refetch', message)
          }
          changes = []
          break
        }
      }
    }
  }
  return { lsn, changes }
}
