'use client'

import React, { useRef, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Button } from '@penx/uikit/button'
import { cn, isIOS } from '@penx/utils'
import { Drawer } from '../ui/Drawer'
import { SearchPanel } from './SearchPanel'

export function SearchButton() {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="size-9 rounded-full"
        onClick={() => setVisible(true)}
      >
        <SearchIcon size={24} />
      </Button>

      <Drawer open={visible} setOpen={setVisible} isFullHeight className="px-0">
        <SearchPanel setVisible={setVisible} />
      </Drawer>
    </>
  )
}
