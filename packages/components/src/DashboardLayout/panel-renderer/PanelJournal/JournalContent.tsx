'use client'

import { Trans } from '@lingui/react/macro'
import { motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { useActiveStruct } from '@penx/hooks/useActiveStruct'
import { useCreations } from '@penx/hooks/useCreations'
import { useJournal } from '@penx/hooks/useJournal'
import { useJournalLayout } from '@penx/hooks/useJournalLayout'
import { cn, mappedByKey } from '@penx/utils'
import { CreationCard } from '../../../CreationCard/CreationCard'
import { JournalTitle } from './JournalTitle'

interface Props {}

export function JournalContent({}: Props) {
  const { creations } = useCreations()
  const { struct } = useActiveStruct()
  const { journal } = useJournal()
  const { isCard, isList } = useJournalLayout()
  const creationMaps = mappedByKey(creations, 'id')

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <JournalTitle date={journal.date!} />
      {/* <StructTypeSelect /> */}

      {!journal.children.length && (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 text-2xl"
          >
            <Trans>What's on your mind today?</Trans>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/40 text-xs"
          >
            <Trans>A structured note-taking App</Trans>
          </motion.div>
        </div>
      )}

      {!!journal.children.length && (
        <div
          className={cn(
            isCard ? 'columns-2 gap-x-2 align-top' : 'flex flex-col gap-4 ',
            // isMobileApp && !isCard && 'gap-6',
            isMobileApp && isList && 'gap-0',
          )}
        >
          {journal.children.map((id) => {
            const creation = creationMaps[id]
            if (!creation) return null
            if (struct && creation.structId !== struct.id) return null
            return <CreationCard key={id} creation={creation}></CreationCard>
          })}
        </div>
      )}
    </div>
  )
}
