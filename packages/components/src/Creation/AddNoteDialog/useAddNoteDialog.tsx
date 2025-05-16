import { atom, useAtom } from 'jotai'
import { Mold } from '@penx/db/client'

type State = {
  isOpen: boolean
  mold: Mold
}

const addNoteDialogAtom = atom<State>({
  isOpen: false,
  mold: null as any,
} as State)

export function useAddNoteDialog() {
  const [state, setState] = useAtom(addNoteDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
