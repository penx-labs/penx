import React from 'react'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
import { Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'
import { useOptionDrawer } from './useOptionDrawer'
import { Option } from '@penx/types'

export function AddOptionButton({
  struct,
  column,
}: {
  struct: Struct
  column: IColumn
}) {
  const { setState } = useOptionDrawer()
  return (
    <div
      className="text-brand flex h-12 items-center gap-1 px-2"
      onClick={() =>
        setState({
          isOpen: true,
          option: { name: '', color: '' } as Option,
          column,
        })
      }
    >
      <PlusIcon size={20} />
      <div>
        <Trans>Add Option</Trans>
      </div>
    </div>
  )
}
