import { Trans } from '@lingui/react'
import {
  CheckCircleIcon,
  CheckIcon,
  ImageIcon,
  Link2Icon,
  LinkIcon,
  TextIcon,
} from 'lucide-react'
import { useMolds } from '@penx/hooks/useMolds'
import { Prop, PropType } from '@penx/types'
import { Input } from '@penx/uikit/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { cn } from '@penx/utils'
import { FileUpload } from '../FileUpload'
import { usePanelCreationContext } from './PanelCreationProvider'
import { SingleSelectProp } from './SingleSelectProp'

interface Props {
  onUpdateProps: (props: any) => void
}

export const PropList = ({ onUpdateProps }: Props) => {
  const creation = usePanelCreationContext()
  const { molds } = useMolds()
  const mold = molds.find((m) => m.id === creation.moldId)
  if (!Array.isArray(mold?.props)) return null
  const props = mold?.props as Prop[]

  // console.log('====-->>props:', post.props, post)

  if (!props.length) return null
  return (
    <div className="mt-4 flex flex-col gap-1">
      {props.map((prop, i) => {
        const props: any = creation.props || {}
        const value = props[prop.id] || ''

        return (
          <div key={i} className="flex gap-2">
            <div className="text-foreground/60 flex w-40 items-center gap-1">
              <div>
                {prop.type === PropType.TEXT && <TextIcon size={16} />}
                {prop.type === PropType.URL && <LinkIcon size={16} />}
                {prop.type === PropType.IMAGE && <ImageIcon size={16} />}
                {prop.type === PropType.SINGLE_SELECT && (
                  <CheckCircleIcon size={16} />
                )}
              </div>
              <span className="text-sm">{prop.name}</span>
            </div>
            <div className="flex-1">
              {prop.type === PropType.TEXT && (
                <Input
                  placeholder=""
                  variant="filled"
                  className=""
                  defaultValue={value}
                  onChange={(e) => {
                    console.log('======>>>>>e:', e.target.value)
                  }}
                />
              )}
              {prop.type === PropType.URL && (
                <Input
                  defaultValue={value}
                  onChange={(e) => {
                    // const newPost = updateProps({
                    //   ...props,
                    //   [prop.id]: e.target.value,
                    // })
                    // onUpdateProps(newPost)
                  }}
                />
              )}
              {prop.type === PropType.IMAGE && (
                <FileUpload
                  value={value}
                  onChange={(v) => {
                    // const newPost = updateProps({
                    //   ...props,
                    //   [prop.id]: v,
                    // })
                    // onUpdateProps(newPost)
                  }}
                />
              )}
              {prop.type === PropType.SINGLE_SELECT && (
                <Select
                  defaultValue={value}
                  onValueChange={(v) => {
                    // const newPost = updateProps({
                    //   ...props,
                    //   [prop.id]: v,
                    // })
                    // onUpdateProps(newPost)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={<Trans id="Select a property"></Trans>}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {prop.options?.map((option, i) => (
                      <SelectItem key={i} value={option.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'size-5 rounded',
                              `bg-${option.color}-500`,
                            )}
                          ></div>
                          <div>{option.name}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
