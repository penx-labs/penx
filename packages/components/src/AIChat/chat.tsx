'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import type { Attachment, UIMessage } from 'ai'
import { useSearchParams } from 'next/navigation'
import useSWR, { useSWRConfig } from 'swr'
import { unstable_serialize } from 'swr/infinite'
import { useArtifactSelector } from '@penx/hooks/use-artifact'
import { queryMessages, refetchMessages } from '@penx/hooks/useMessages'
import { useMySite } from '@penx/hooks/useMySite'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { PanelType, SessionData } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { Artifact } from './artifact'
import { Messages } from './messages'
import { MultimodalInput } from './multimodal-input'
import { getChatHistoryPaginationKey } from './sidebar-history'
import { toast } from './toast'
import type { VisibilityType } from './visibility-selector'

interface ApplicationError extends Error {
  info: string
  status: number
}

export function Chat({
  id,
  initialMessages,
  isReadonly,
  session,
}: {
  id: string
  initialMessages: Array<UIMessage>
  isReadonly: boolean
  session: SessionData
}) {
  const { site } = useMySite()

  const provider = site?.props?.aiSetting?.providers?.[0]

  // Track the selected provider and model
  const [selectedProvider, setSelectedProvider] = useState(provider?.type || '')
  const [selectedModel, setSelectedModel] = useState(
    provider?.defaultModel || '',
  )

  // Refs to store latest values for the closure in generateId
  const selectedProviderRef = useRef(selectedProvider)
  const selectedModelRef = useRef(selectedModel)

  // Update refs when state changes
  useEffect(() => {
    selectedProviderRef.current = selectedProvider
    selectedModelRef.current = selectedModel
  }, [selectedProvider, selectedModel])

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: uniqueId,
    experimental_prepareRequestBody: (body) => {
      // Find the current provider based on selected type
      const currentProvider = site?.props?.aiSetting?.providers?.find(
        (p) => p.type === selectedProviderRef.current,
      )

      return {
        id,
        message: body.messages.at(-1),
        selectedChatModel:
          selectedModelRef.current || currentProvider?.defaultModel,
        provider: selectedProviderRef.current || provider?.type,
        apiKey: currentProvider?.apiKey || provider?.apiKey,
        baseURL: currentProvider?.baseURL || provider?.baseURL,
      }
    },
    onFinish: async (message, options) => {
      await localDB.message.add({
        id: uniqueId(),
        chatId: id,
        role: 'user',
        parts: [{ type: 'text', text: input }],
        siteId: session.siteId,
        createdAt: new Date(),
      })

      await localDB.message.add({
        id: uniqueId(),
        chatId: id,
        role: message.role,
        parts: message.parts,
        siteId: session.siteId,
        createdAt: new Date(),
      })
    },
    onError: async (error) => {
      console.log('=====error:', error)

      toast({
        type: 'error',
        description: error.message,
      })
      if (error.message === 'Please provide an API key') {
        store.panels.addPanel({
          type: PanelType.AI_SETTING,
        })

        const messages = await queryMessages(session.siteId)
        setTimeout(() => {
          setMessages(messages)
        }, 2000)
      }
    },
  })

  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible)

  // Handle provider and model selection
  const handleProviderChange = (providerType: string) => {
    setSelectedProvider(providerType)
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
  }

  return (
    <>
      <div className="flex h-full min-w-0 flex-col">
        <Messages
          chatId={id}
          status={status}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="gap-2px-4 mx-auto flex w-full  pb-6 md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              onProviderChange={handleProviderChange}
              onModelChange={handleModelChange}
            />
          )}
        </form>
      </div>
    </>
  )
}
