import { Suspense, useState } from 'react'
import { Box } from '@fower/react'
import { Button, Input, Skeleton } from 'uikit'
import { GoogleDrive } from '@penx/google-drive'
import { useUser } from '@penx/hooks'
import { trpc } from '@penx/trpc-client'
import { GoogleOauthButton } from '../RecoveryPhrase/GoogleOauthButton'
import { GoogleBackupConnected } from './GoogleBackupConnected'

function Content() {
  const {
    data: token,
    isLoading,
    refetch,
  } = trpc.google.googleDriveToken.useQuery()
  if (isLoading) {
    return <Skeleton h-56 w-280 roundedXL></Skeleton>
  }

  if (!token?.access_token) {
    return (
      <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
        <GoogleOauthButton />
      </Suspense>
    )
  }

  return <GoogleBackupConnected data={token} refetch={refetch} />
}

export function GoogleBackup() {
  const [value, setValue] = useState<any>()
  const { data: token } = trpc.google.googleDriveToken.useQuery()
  return (
    <Box relative column gap6>
      <Box>
        <Box mb4 fontSemibold text={[24, 24]}>
          Google Drive backup
        </Box>
        <Box gray600 mb1>
          In PenX, one of most important concept is owning your data. you can
          use Google Drive to backup your data.
        </Box>
      </Box>
      <Content />
    </Box>
  )
}
