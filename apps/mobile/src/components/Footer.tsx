import React from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { createGesture, IonButton, IonFab, IonText } from '@ionic/react'
import { PlusIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useLongPress } from 'use-long-press'
import { cn } from '@penx/utils'
import { useMoreStructDrawer } from './MoreStructDrawer/useMoreStructDrawer'
import { VoiceRecorderButton } from './VoiceRecorderButton'

interface Props {
  open: boolean
  onAdd: () => void
}

export const Footer = ({ open, onAdd }: Props) => {
  const { setIsOpen } = useMoreStructDrawer()
  // if (open) return null
  const handlers = useLongPress(async () => {
    setIsOpen(true)
    await Haptics.impact({ style: ImpactStyle.Medium })
  })

  return (
    <IonFab
      slot="fixed"
      vertical="bottom"
      horizontal="center"
      className="flex w-full flex-col"
    >
      {/* <IonFabButton></IonFabButton> */}

      <div
        className={cn(
          'relative inline-flex items-center justify-center gap-3 pb-6',
        )}
      >
        <div className="relative inline-flex">
          <motion.div
            {...handlers()}
            whileTap={{ scale: 1.2 }}
            className="text-background shadow-popover dark:bg-brand bg-background relative flex  size-14 select-none items-center justify-center rounded-full"
            onClick={async () => {
              onAdd()
            }}
          >
            <PlusIcon size={28} className="text-foreground" />
          </motion.div>

          <VoiceRecorderButton />
        </div>
      </div>
    </IonFab>
  )
}
