'use client'

import React, { useRef, useState } from 'react'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { UserRoundIcon } from 'lucide-react'
import { Drawer } from 'vaul'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import { DialogDescription, DialogTitle } from '@penx/uikit/dialog'
import { getUrl } from '@penx/utils'
import { LoginDrawerContent } from './LoginDrawerContent'

export function LoginButton() {
  const { isLoading, session } = useSession()
  const [visible, setVisible] = useState(false)
  if (session) {
    return (
      <Avatar className="size-7">
        <AvatarImage src={getUrl(session?.image)} />
        <AvatarFallback>{session?.name}</AvatarFallback>
      </Avatar>
    )
  }
  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="size-7 rounded-full"
        onClick={() => setVisible(true)}
      >
        <UserRoundIcon size={20} />
      </Button>

      <Drawer.Root open={visible} onOpenChange={setVisible}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background fixed bottom-0 left-0 right-0 flex max-h-[95vh] min-h-[95vh] flex-col rounded-t-[10px] px-0 pb-0 outline-none">
            <div
              aria-hidden
              className="mx-auto mb-4 mt-2 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />

            <DialogTitle className="hidden">
              <DialogDescription />
            </DialogTitle>
            {session && <div>{JSON.stringify(session, null, 2)}</div>}
            <LoginDrawerContent setVisible={setVisible} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
