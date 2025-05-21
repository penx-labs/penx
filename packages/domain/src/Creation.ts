import { format } from 'date-fns'
import { Node } from 'slate'
import { ICreationNode, NodeType } from '@penx/model-type'
import { StructType } from '@penx/types'
import { getUrl } from '@penx/utils'

export class Creation {
  props: ICreationNode['props']

  constructor(public raw: ICreationNode) {
    this.props = this.raw?.props || {}
  }

  get id(): string {
    return this.raw?.id || ''
  }

  get siteId(): string {
    return this.raw.siteId
  }

  get userId(): string {
    return this.raw.siteId
  }

  get areaId(): string {
    return this.raw.props.areaId || ''
  }

  get slug(): string {
    return this.raw.props.slug
  }

  get gateType(): string {
    return this.raw.props.gateType
  }

  get collectible() {
    return this.raw.props.collectible
  }

  get delivered() {
    return this.raw.props.delivered
  }

  get structId(): string {
    return this.raw.props.structId
  }

  get type(): string {
    return this.props?.type || ''
  }

  get title(): string {
    return this.props.title || ''
  }

  get status() {
    return this.props.status
  }

  get image() {
    return this.props.image ? getUrl(this.props.image) : ''
  }

  get checked() {
    return this.props.checked
  }

  get cells() {
    return this.props.cells
  }

  get content() {
    return this.props.content
  }

  get previewedContent() {
    const content: any[] = JSON.parse(this.content)
    const str = content.map((n) => Node.string(n)).join(' ')
    return str
  }

  get podcast() {
    return this.props.podcast
  }

  get isTask() {
    return this.type === StructType.TASK
  }

  get isNote() {
    return this.type === StructType.NOTE
  }

  get isBookmark() {
    return this.type === StructType.BOOKMARK
  }

  get publishedAt() {
    return this.props.publishedAt
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }

  get formattedTime() {
    return format(this.createdAt, 'HH:mm:ss')
  }
}
