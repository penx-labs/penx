'use client'

import { Trans } from '@lingui/react/macro'
import { ROOT_DOMAIN } from '@penx/constants'
import { useSite } from '@penx/hooks/useSite'
import { useRouter } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback } from '@penx/uikit/ui/avatar'
import { Button, ButtonProps } from '@penx/uikit/ui/button'
import { LoginDialog } from '@penx/widgets/LoginDialog/LoginDialog'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { LoginButton } from '../LoginButton'
import { ProfilePopover } from './ProfilePopover'

interface Props {
  showDashboard?: boolean
  buttonProps?: ButtonProps
  appearance?: 'button' | 'icon'
}

export function Profile({
  showDashboard = false,
  buttonProps,
  appearance = 'button',
}: Props) {
  const { data, status } = useSession()
  const { site } = useSite()
  const { push } = useRouter()

  if (status === 'loading')
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback></AvatarFallback>
      </Avatar>
    )

  const authenticated = !!data

  return (
    <>
      <LoginDialog />
      {!authenticated && (
        <LoginButton {...buttonProps} appearance={appearance} />
      )}
      {authenticated && (
        <div className="flex items-center gap-2">
          {showDashboard && (
            <Button
              size="sm"
              onClick={() => {
                if (location.host === ROOT_DOMAIN) {
                  const path = `/~/areas/${data.activeAreaId}`
                  push(path)
                  return
                }
                location.href = `${location.protocol}//${ROOT_DOMAIN}/~`
              }}
            >
              <Trans>Dashboard</Trans>
            </Button>
          )}
          <ProfilePopover />
        </div>
      )}
    </>
  )
}
