import { ReactNode } from 'react'
import {
  AudioLinesIcon,
  BookmarkIcon,
  Columns2Icon,
  FileText,
  ImageIcon,
  Pen,
  PresentationIcon,
  Users2Icon,
} from 'lucide-react'
import { StructType } from '@penx/types'

export function getCreationIcon(type: any): ReactNode {
  if (type === StructType.ARTICLE) return <FileText size={16} />
  // if (type === StructType.NOTE) return <Pen size={16} />
  if (type === StructType.NOTE)
    return <span className="icon-[mdi--feather] size-5"></span>

  if (type === StructType.BOOKMARK) return <BookmarkIcon size={16} />
  if (type === StructType.IMAGE) return <ImageIcon size={16} />
  if (type === StructType.PAGE) return <Columns2Icon size={16} />
  if (type === StructType.AUDIO) return <AudioLinesIcon size={16} />
  if (type === StructType.FRIEND) return <Users2Icon size={16} />
  if (type === StructType.PROJECT) return <PresentationIcon size={16} />
  if (type === StructType.VOICE) return <AudioLinesIcon size={16} />

  if (type === StructType.TASK)
    return <span className="icon-[mdi--checkbox-outline] size-5"></span>

  return null
}
