import { get, set } from 'idb-keyval'
import { Node } from '@penx/domain'
import { localDB } from '@penx/local-db'
import {
  IAreaNode,
  ICreationNode,
  isAreaNode,
  isCreationNode,
  isCreationTagNode,
  ISiteNode,
  isMoldNode,
  isTagNode,
  NodeType,
} from '@penx/model-type'
import { updateSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { Panel, PanelType, SessionData, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { initLocalSite } from './lib/initLocalSite'
import { isRowsEqual } from './lib/isRowsEqual'
import { syncNodesToLocal } from './lib/syncNodesToLocal'

const PANELS = 'PANELS'

export class AppService {
  inited = false

  async init(session: SessionData) {
    // console.log('========session:', session)

    store.app.setAppLoading(true)
    // store.app.setAppLoading(false)
    // return

    const site = await this.getInitialSite(session)

    await this.initStore(site)
    this.inited = true
  }

  private async getInitialSite(session: SessionData): Promise<ISiteNode> {
    if (!session) {
      const sites = await localDB.listAllSites()
      const site = sites.find((s) => s.props.isRemote) || sites?.[0]
      if (site) return site
      return initLocalSite()
    }

    if (!navigator.onLine) {
      if (!session.siteId) {
        const sites = await localDB.listAllSites()
        if (sites) return sites[0]
        return initLocalSite()
      }

      const site = await localDB.getSite(session.siteId)
      if (site) return site
      return initLocalSite()
    }

    if (session.siteId) {
      const sites = await localDB.listAllSiteByUserId(session.userId)
      const site = sites.find((s) => s.props.isRemote)

      if (site) {
        await syncNodesToLocal(site.id)
        return site
      }

      const remoteSite = await syncNodesToLocal(session.siteId)
      return remoteSite
    }

    let site = await localDB.getSiteByUserId(session.userId)

    if (!site) {
      site = await initLocalSite(session.userId)
    }

    const nodes = await localDB.listNodes(site.id)

    const { existed, siteId } = await api.site.syncInitialNodes.mutate({
      nodes,
    })

    if (existed) {
      site = await syncNodesToLocal(siteId)
    } else {
      await localDB.updateSiteProps(site.id, { isRemote: true })
      await syncNodesToLocal(site.id)
    }

    await updateSession({
      activeSiteId: site.id,
      siteId: site.id,
    })
    return site
  }

  private async initStore(site: ISiteNode) {
    console.log('=============site..:', site)
    await store.site.save(site)

    const panels = await this.getPanels(site.id)
    const nodes = await localDB.listNodes(site.id)
    const areas = nodes.filter((n) => isAreaNode(n))

    const localVisit = await store.visit.fetch()

    const area =
      areas.find(
        (a) => a.id === localVisit.activeAreaId || a.props.isGenesis,
      ) || areas[0]

    const visit = await store.visit.save({ activeAreaId: area.id })
    const molds = nodes.filter((n) => isMoldNode(n))
    const tags = nodes.filter((n) => isTagNode(n))
    const creationTags = nodes.filter((n) => isCreationTagNode(n))
    const creations = nodes.filter(
      (n) => isCreationNode(n) && n.areaId === area.id,
    )

    store.site.set(site)
    store.creations.set(creations as ICreationNode[])
    store.visit.set(visit)
    store.area.set(area)
    store.areas.set(areas)
    store.molds.set(molds)
    store.tags.set(tags)
    store.creationTags.set(creationTags)
    store.panels.set(panels)
    store.app.setAppLoading(false)
  }

  private async getPanels(siteId: string) {
    const key = `${PANELS}_${siteId}`
    const panels: Panel[] = (await get(key)) || []
    if (!panels.length) {
      const defaultPanels = [
        {
          id: uniqueId(),
          type: PanelType.HOME,
        } as Panel,
      ]
      set(key, defaultPanels)
      return defaultPanels
    }
    return panels
  }
}
