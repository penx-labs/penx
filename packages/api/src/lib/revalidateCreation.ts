import { revalidateTag } from 'next/cache'
import { calculateSHA256FromString } from '@penx/encryption'
import { CreationById } from '@penx/types'

export function revalidateCreation(_creation: any) {
  const creation = _creation as CreationById

  if (creation.struct?.type) {
    revalidateTag(`${creation.siteId}-${creation.struct.type.toLowerCase()}s`)
  }
}

/**
 * Helper function: Invalidate cache for tag-related data
 * @param siteId - The site ID
 * @param postTags - The post tag associations list
 */
export function revalidateCreationTags(
  siteId: string,
  postTags?: { tag: { name: string } }[],
) {
  if (!postTags?.length) return

  postTags.forEach((postTag) => {
    revalidateTag(
      `${siteId}-tags-${calculateSHA256FromString(postTag.tag.name)}`,
    )
  })
}
