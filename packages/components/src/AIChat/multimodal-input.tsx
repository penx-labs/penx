'use client'

import type React from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { Attachment, UIMessage } from 'ai'
import cx from 'classnames'
import equal from 'fast-deep-equal'
import { CogIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Textarea } from '@penx/uikit/textarea'
import { ArrowUpIcon, PaperclipIcon, StopIcon } from './icons'
import { KnowledgeSourcePicker } from './knowledge-source-picker'
import { PreviewAttachment } from './preview-attachment'
import { ProviderSelector } from './provider-selector'

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
}: {
  chatId: string
  input: UseChatHelpers['input']
  setInput: UseChatHelpers['setInput']
  status: UseChatHelpers['status']
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  messages: Array<UIMessage>
  setMessages: UseChatHelpers['setMessages']
  append: UseChatHelpers['append']
  handleSubmit: UseChatHelpers['handleSubmit']
  className?: string
  selectedProvider?: string
  selectedModel?: string
  onProviderChange?: (providerType: string) => void
  onModelChange?: (modelId: string) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()

  const handleProviderChange = (providerType: string) => {
    onProviderChange?.(providerType)
  }

  const handleModelChange = (modelId: string) => {
    onModelChange?.(modelId)
    console.log('Selected model:', modelId)
  }

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '98px'
    }
  }

  const [localStorageInput, setLocalStorageInput] = useLocalStorage('input', '')

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ''
      setInput(finalValue)
      adjustHeight()
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

  const submitWithModel = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
      // @ts-ignore TODO:
      data: selectedProvider
        ? {
            provider: selectedProvider,
            model: selectedModel,
          }
        : undefined,
    })

    setAttachments([])
    setLocalStorageInput('')
    resetHeight()

    if (width && width > 768) {
      textareaRef.current?.focus()
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
    selectedProvider,
    selectedModel,
  ])

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const { url, pathname, contentType } = data

        return {
          url,
          name: pathname,
          contentType: contentType,
        }
      }
      const { error } = await response.json()
      toast.error(error)
    } catch (error) {
      toast.error('Failed to upload file, please try again!')
    }
  }

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])

      setUploadQueue(files.map((file) => file.name))

      try {
        const uploadPromises = files.map((file) => uploadFile(file))
        const uploadedAttachments = await Promise.all(uploadPromises)
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        )

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ])
      } catch (error) {
        console.error('Error uploading files!', error)
      } finally {
        setUploadQueue([])
      }
    },
    [setAttachments],
  )

  return (
    <div className="relative flex w-full flex-col gap-4">
      <input
        type="file"
        className="pointer-events-none fixed -left-4 -top-4 size-0.5 opacity-0"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />
      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div
          data-testid="attachments-preview"
          className="flex flex-row items-end gap-2 overflow-x-scroll"
        >
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: '',
                name: filename,
                contentType: '',
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}
      <Textarea
        data-testid="multimodal-input"
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          'bg-muted max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-2xl pb-10 !text-base dark:border-zinc-700',
          className,
        )}
        rows={2}
        autoFocus
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()

            if (status !== 'ready') {
              toast.error('Please wait for the model to finish its response!')
            } else {
              submitWithModel()
            }
          }
        }}
      />
      <div className="absolute bottom-0 flex w-fit flex-row justify-start gap-0.5 p-2">
        <AttachmentsButton fileInputRef={fileInputRef} status={status} />
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-foreground/10 size-7 rounded-md"
          type="button"
          onClick={() => {
            store.panels.addPanel({
              type: PanelType.AI_SETTING,
            })
          }}
        >
          <CogIcon size={16} />
        </Button>
        <ProviderSelector
          onProviderChange={onProviderChange}
          onModelChange={onModelChange}
        />
      </div>
      <div className="absolute bottom-0 right-0 flex w-fit flex-row justify-end p-2">
        <KnowledgeSourcePicker />
        <div>
          {status === 'submitted' ? (
            <StopButton stop={stop} setMessages={setMessages} />
          ) : (
            <SendButton
              input={input}
              submitForm={submitWithModel}
              uploadQueue={uploadQueue}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false
    if (prevProps.status !== nextProps.status) return false
    if (!equal(prevProps.attachments, nextProps.attachments)) return false

    return true
  },
)

function PureAttachmentsButton({
  fileInputRef,
  status,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>
  status: UseChatHelpers['status']
}) {
  return (
    <Button
      data-testid="attachments-button"
      className="h-fit rounded-md rounded-bl-lg p-[7px] hover:bg-zinc-200 dark:border-zinc-700 hover:dark:bg-zinc-900"
      onClick={(event) => {
        toast.info('Coming soon!')
        // event.preventDefault()
        // fileInputRef.current?.click()
      }}
      disabled={status !== 'ready'}
      variant="ghost"
    >
      <PaperclipIcon size={14} />
    </Button>
  )
}

const AttachmentsButton = memo(PureAttachmentsButton)

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void
  setMessages: UseChatHelpers['setMessages']
}) {
  return (
    <Button
      data-testid="stop-button"
      className="h-fit rounded-full border p-1.5 dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault()
        stop()
        setMessages((messages) => messages)
      }}
    >
      <StopIcon size={14} />
    </Button>
  )
}

const StopButton = memo(PureStopButton)

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void
  input: string
  uploadQueue: Array<string>
}) {
  return (
    <Button
      data-testid="send-button"
      className="h-fit rounded-full border p-1.5 dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault()
        submitForm()
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false
  if (prevProps.input !== nextProps.input) return false
  return true
})
