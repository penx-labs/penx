import React from 'react'
import { Box } from '@fower/react'
import { Gem } from 'lucide-react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { Button, Spinner } from 'uikit'
import { trpc } from '@penx/trpc-client'
import { WalletConnectButton } from '../WalletConnectButton'
import { BountyLogo } from './BountyLogo'
import { ClaimButton } from './ClaimButton'
import { WalletProfile } from './WalletProfile'

type Reward = {
  amount: string
  token: string
}

const Task = () => {
  const { query } = useRouter()
  const id = query.id as string

  const { data, isLoading, isError } = trpc.bounty.byId.useQuery({ id })

  const { isConnected } = useAccount()

  console.log('=====isConnected:', isConnected)

  if (isLoading) {
    return (
      <Box h-100vh toCenter>
        <Spinner />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box h-100vh toCenter gray400>
        Bounty Not Found
      </Box>
    )
  }

  const issueId = data.issueUrl?.split('/').pop()

  const rewards = data.rewards as Reward[]

  return (
    <Box toCenter h-100vh>
      <Box toBetween toCenterY absolute top0 w-100p px4 py2>
        <BountyLogo />
        <WalletProfile />
      </Box>
      <Box w-600 toCenter column gap4>
        <Box>
          <Box
            as="a"
            href={data.issueUrl!}
            target="_blank"
            noUnderline
            gray400
            fontSemibold
            text2XL
          >
            #{issueId}
          </Box>
        </Box>
        <Box
          as="a"
          href={data.issueUrl!}
          target="_blank"
          text3XL
          black
          noUnderline
          underline--hover
          transitionCommon
          fontBold
          leadingNone
        >
          {data.title}
        </Box>
        <Box toCenterX gap4>
          {rewards.map((reward) => (
            <Box key={reward.token} toCenterY gap1>
              {reward.token === 'USDT' && (
                <Box as="img" src="/images/USDT.svg" square6 />
              )}
              {reward.token === 'PENX' && (
                <Box inlineFlex>
                  <Gem size={20}></Gem>
                </Box>
              )}
              <Box textXL>
                {reward.amount} {reward.token}
              </Box>
            </Box>
          ))}
        </Box>
        {isConnected && <ClaimButton bountyId={data.id} />}
        {!isConnected && (
          <WalletConnectButton size={48}>
            Connect wallet to claim
          </WalletConnectButton>
        )}
      </Box>
    </Box>
  )
}

export default Task