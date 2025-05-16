import { ExternalLink } from 'lucide-react'
import { Github } from '@penx/components/SocialIcon'
import { updateSiteState, useQuerySite } from '@penx/hooks/useQuerySite'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import { Button } from '@penx/uikit/button'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface Props {
  repo: string
}

export function GithubConnectedBox({ repo }: Props) {
  const { site } = useQuerySite()
  return (
    <div className="border-foreground/10 flex items-center justify-between rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <Github className="h-6 w-6" />
        <div className="text-base">{repo}</div>
        <a href={`https://github.com/${repo}`} target="_blank">
          <ExternalLink size={16} />
        </a>
      </div>
      <ConfirmDialog
        title="Sure to disconnect?"
        content="Are you sure you want to disconnect?"
        onConfirm={async () => {
          await api.github.disconnectRepo.mutate()

          updateSiteState({
            installationId: null,
            repo: '',
          })
        }}
      >
        <Button variant="outline">Disconnect</Button>
      </ConfirmDialog>
    </div>
  )
}
