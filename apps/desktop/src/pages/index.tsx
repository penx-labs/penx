import { PropsWithChildren, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Head from 'next/head'
import { EditorApp } from '@penx/app'
import { appEmitter } from '@penx/event'
import { SessionProvider, useSession } from '@penx/session'
import { getLocalSession } from '@penx/storage'
import {
  FirstLocalSpaceGenerator,
  RecoveryPhraseLoginProvider,
} from '@penx/widget'

const OnlineProvider = ({ children }: PropsWithChildren) => {
  const { data, loading } = useSession()

  if (loading) return null

  if (!navigator.onLine) return <>{children}</>

  // not logged in
  if (!data) {
    return <FirstLocalSpaceGenerator>{children}</FirstLocalSpaceGenerator>
  }

  return <RecoveryPhraseLoginProvider>{children}</RecoveryPhraseLoginProvider>
}

export default function Home() {
  const { isLoading, data, refetch } = useQuery(['session'], async () => {
    const session = await getLocalSession()
    return session ? session : null
  })

  useEffect(() => {
    appEmitter.on('LOGIN_BY_PERSONAL_TOKEN_SUCCESSFULLY', () => {
      refetch()
    })
  }, [])

  return (
    <>
      <Head>
        <title>PenX</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider
        value={{
          data: data!,
          loading: isLoading,
        }}
      >
        <OnlineProvider>
          <EditorApp />
        </OnlineProvider>
      </SessionProvider>
    </>
  )
}
