import { defaultNavLinks, editorDefaultValue } from '@penx/constants'
import { AreaType, ChargeMode } from '@penx/db/client'
import { getDefaultStructs } from '@penx/libs/getDefaultStructs'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import { localDB } from '@penx/local-db'
import { ISiteNode, IStructNode, NodeType } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'

export async function initLocalSite(uid?: string) {
  return await localDB.transaction('rw', localDB.node, async () => {
    const siteId = uniqueId()
    const userId = uid || uniqueId()
    await localDB.node.add({
      id: siteId,
      type: NodeType.SITE,
      siteId: siteId,
      props: {
        name: 'My Site',
        description: '',
        about: JSON.stringify(editorDefaultValue),
        logo: '',
        font: '',
        image: '',
        podcastCover: '',
        email: '',
        socials: {},
        analytics: {},
        config: {
          locales: ['en', 'zh-CN', 'ja'],
        },
        navLinks: defaultNavLinks,
        newsletterConfig: {},
        notificationConfig: {},
        aiSetting: {},
        repo: '',
        installationId: 0,
        balance: 0,
        themeName: 'garden',
        themeConfig: {},
        memberCount: 0,
        creationCount: 0,
        isRemote: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    } as ISiteNode)

    const areaId = await localDB.node.add({
      id: uniqueId(),
      type: NodeType.AREA,
      props: {
        slug: 'first-area',
        name: 'First area',
        description: 'An area for sharing thoughts, stories, and insights.',
        about: JSON.stringify(editorDefaultValue),
        logo: '',
        chargeMode: ChargeMode.FREE,
        widgets: getInitialWidgets(),
        isGenesis: true,
        favorites: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      siteId,
      userId,
    })

    await localDB.node.bulkPut(
      getDefaultStructs({
        siteId: siteId,
        userId,
        areaId,
      }),
    )

    // const structs = (await localDB.node
    //   .where({ type: NodeType.STRUCT, siteId })
    //   .toArray()) as unknown as IStructNode[]

    const site = await localDB.node.get(siteId)
    console.log('init local site!!!')
    return site as ISiteNode
  })
}
