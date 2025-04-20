import { prisma } from '@penx/db'
import { CreationStatus } from '@prisma/client'

export async function getCreation(id: string) {
  const creation = await prisma.creation.findUniqueOrThrow({
    include: {
      mold: true,
      creationTags: { include: { tag: true } },
      authors: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
              displayName: true,
              ensName: true,
            },
          },
        },
      },
    },
    where: { id },
  })
  return creation
}
