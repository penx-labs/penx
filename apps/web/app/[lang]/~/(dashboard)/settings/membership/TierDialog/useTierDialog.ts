import { atom, useAtom } from 'jotai'
import { Product } from '@penx/db/client'

type State = {
  isOpen: boolean
  tier: Product
}

const tierDialogAtom = atom<State>({
  isOpen: false,
  tier: null as any,
} as State)

export function useTierDialog() {
  const [state, setState] = useAtom(tierDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
