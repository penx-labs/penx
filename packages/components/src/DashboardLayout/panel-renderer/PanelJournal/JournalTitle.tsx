import { format } from 'date-fns'
import { isMobileApp } from '@penx/constants'
import { Badge } from '@penx/uikit/ui/badge'
import { cn } from '@penx/utils'
import { JournalNav } from './JournalNav'

interface Props {
  date: string
}

export const JournalTitle = ({ date }: Props) => {
  const formattedDate = format(new Date(date || Date.now()), 'LLL do')

  return (
    <div
      className={cn(
        'flex flex-row gap-2 leading-none md:flex-col',
        isMobileApp && 'justify-between',
      )}
    >
      <div className="text-3xl font-bold">{formattedDate}</div>
      <JournalNav date={date} />
    </div>
  )
}
