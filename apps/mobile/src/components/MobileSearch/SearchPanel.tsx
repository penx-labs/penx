'use client'

import React, { useMemo, useState } from 'react'
import { appEmitter } from '@penx/emitter'
import { creationIdAtom } from '@penx/hooks/useCreationId'
import { useCreations } from '@penx/hooks/useCreations'
import { store } from '@penx/store'
import { Input } from '@penx/uikit/input'

interface Props {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export function SearchPanel({ setVisible }: Props) {
  const { creations } = useCreations()
  const recentCreations = creations.slice(0, 20)
  const [search, setSearch] = useState('')
  const q = search.replace(/^@(\s+)?/, '') || ''

  const filteredItems = useMemo(() => {
    if (!q) return recentCreations
    const items = recentCreations.filter(({ title = '' }) => {
      return title?.toLowerCase().includes(q.toLowerCase())
    })

    return items
  }, [recentCreations, q])
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden">
      <div className="px-4">
        <Input
          variant="filled"
          className="w-full"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-auto px-4 pb-10">
        {!filteredItems.length && (
          <div className="flex h-16 items-center justify-center text-sm">
            No results found.
          </div>
        )}
        {
          <div className="flex flex-col gap-1">
            {filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  className=""
                  onClick={() => {
                    close()
                    setSearch('')
                    appEmitter.emit('ROUTE_TO_CREATION', item)
                    store.set(creationIdAtom, item.id)
                    setVisible(false)
                  }}
                >
                  {item.title || 'Untitled'}
                </div>
              )
            })}
          </div>
        }
      </div>
    </div>
  )
}
