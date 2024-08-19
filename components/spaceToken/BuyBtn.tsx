import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'
import LoadingDots from '../icons/loading-dots'
import { Button } from '../ui/button'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'
import { WalletConnectButton } from '../WalletConnectButton'
import { Space } from '@/app/~/space/[id]/hooks/useSpace'
import { Address } from 'viem'
import { spaceAbi } from '@/lib/abi/indieX'
import { extractErrorMessage } from '@/lib/extractErrorMessage'

interface Props {
  ethAmount: string;
  handleSwap: () => void;
  isInsufficientBalance: boolean;
  isAmountValid: boolean;
  isConnected: boolean;
  space: Space
}

export const BuyBtn = ({
  ethAmount,
  isInsufficientBalance,
  isAmountValid,
  handleSwap,
  isConnected,
  space
}: Props) => {
  const { writeContractAsync, isPending } = useWriteContract()
  const balance = useSpaceTokenBalance()

  const onBuy = async () => {
    try {
      const value = precision.token(parseFloat(ethAmount), 18)
      const hash = await writeContractAsync({
        address: space.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'buy',
        value
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      await balance.refetch()
      handleSwap()
      toast.success(`${space?.name} bought successfully!`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <>
      {isConnected ? <Button
        className="w-full h-[58px]"
        disabled={!isAmountValid || isInsufficientBalance || isPending}
        onClick={() => onBuy()}
      >
        {isPending || balance.isPending ? (
          <LoadingDots color="white" />
        ) : (
          isInsufficientBalance
            ? 'Insufficient ETH balance'
            : isAmountValid
              ? 'Buy'
              : 'Enter an amount'
        )}
      </Button> :
        <WalletConnectButton className="w-full h-[58px]">
          Connect wallet
        </WalletConnectButton>}
    </>
  )
}
