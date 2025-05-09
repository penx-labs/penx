'use client'

import { Shape, ShapeStream } from '@electric-sql/client'
import { SHAPE_URL } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { getSession } from '@penx/session'
import { store } from '@penx/store'
import { isRowsEqual } from './isRowsEqual'

export function syncAreasToLocal(siteId: string) {
  //
  console.log('=======SHAPE_URL:', SHAPE_URL)

  const stream = new ShapeStream({
    url: SHAPE_URL,
    params: {
      table: 'area',
      where: `"siteId" = '${siteId}'`,
    },
  })

  const shape = new Shape(stream)

  // stream.subscribe(async (data) => {
  //   console.log('tagStream=============:', data)
  // })

  shape.subscribe(async ({ rows }) => {
    console.log('area rows=======:', rows)

    // const areas = await localDB.area.where({ siteId }).toArray()

    // const isEqual = isRowsEqual(rows, areas, [
    //   'id',
    //   'slug',
    //   'name',
    //   'description',
    //   'about',
    //   'logo',
    //   'cover',
    //   'widgets',
    //   'type',
    //   'favorites',
    //   'userId',
    //   'siteId',
    // ])
    // console.log('-=========>>isEqual:', isEqual)

    // if (isEqual) return

    const tx = localDB
      .transaction('rw', localDB.area, async () => {
        console.log('start sync area')

        await localDB.area.where({ siteId }).delete()
        await localDB.area.bulkPut(rows as any)

        const areas = await localDB.area.where({ siteId }).toArray()
        console.log('area updated....')

        const { activeAreaId } = store.visit.get()
        const area = areas.find((a) => a.id === activeAreaId)

        store.areas.set(areas)

        if (area) {
          store.area.set(area)
        }
      })
      .then(() => {
        console.log('Transaction committed')
      })
      .catch((err) => {
        console.error(err)
      })
  })
}
