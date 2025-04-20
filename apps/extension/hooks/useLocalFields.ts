import { FIELDS_KEY } from '@/lib/helper'
import { useStorage } from '@plasmohq/storage/hook'
import { Area } from '@prisma/client'

export function useLocalFields() {
  const [fields, setFields] = useStorage<Area[]>(FIELDS_KEY, [])
  return { fields, setFields }
}
