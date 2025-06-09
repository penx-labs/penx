import { CheckIcon } from 'lucide-react'
import { cn } from '@penx/utils'

interface ItemProps {
  checked?: boolean
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

export function MenuItem({ className, children, onClick, checked }: ItemProps) {
  return (
    <div
      className={cn('flex items-center justify-between px-3 py-3', className)}
      onClick={() => {
        onClick && onClick()
      }}
    >
      <div>{children}</div>
      {checked && <CheckIcon size={18} className="text-foreground/60" />}
    </div>
  )
}
