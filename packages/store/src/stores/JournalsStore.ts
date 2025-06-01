import { format } from 'date-fns'
import { produce } from 'immer'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { IJournalNode, NodeType } from '@penx/model-type'
import { PanelType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { StoreType } from '../store-types'

export const journalsAtom = atom<IJournalNode[]>([] as IJournalNode[])

export class JournalsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(journalsAtom)
  }

  set(state: IJournalNode[]) {
    this.store.set(journalsAtom, state)
  }

  getTodayJournal() {
    const journals = this.store.journals.get()
    return journals.find(
      (j) => j.props.date === format(new Date(), 'yyyy-MM-dd'),
    )
  }

  // getActiveJournal() {
  //   const panels = this.store.panels.get()
  //   const journalPanel = panels.find((p) => p.type === PanelType.JOURNAL)!

  //   const journals = this.get()
  //   const journal = journals.find((j) => j.id === journalPanel.id)!
  // }

  async persistJournal(id: string, input: Partial<IJournalNode['props']>) {
    await localDB.updateJournalProps(id, input)
  }

  async refetchJournals(areaId?: string) {
    const area = this.store.area.get()
    const journals = await localDB.listJournals(areaId || area.id)
    this.set(journals)
    return journals
  }

  async goToDay(date: Date) {
    const { isCreate, journal } = await this.getOrCreateJournal(date)
    const journals = this.get()
    const newJournals = produce(journals, (draft) => {
      if (isCreate) draft.push(journal)
    })
    this.set(newJournals)
    this.store.panels.updateJournalPanel(format(date, 'yyyy-MM-dd'))
  }

  checkTodayJournal() {
    const todayJournal = this.getTodayJournal()

    if (!todayJournal) {
      this.goToDay(new Date())
      this.store.panels.updateJournalPanel(format(new Date(), 'yyyy-MM-dd'))
    }
  }

  async addCreationToJournal(creationId: string, date: string) {
    const journals = this.get()

    const { isCreate, journal } = await this.getOrCreateJournal(new Date(date))

    const newJournals = produce(journals, (draft) => {
      if (isCreate) draft.push(journal)
      for (const item of draft) {
        if (item.id === journal.id) {
          console.log('=======creationId:', creationId)
          item.props.children.unshift(creationId)
          break
        }
      }
    })

    console.log('========newJournals:', newJournals, 'journal:', journal)

    this.set(newJournals)

    await localDB.updateJournalProps(journal.id, {
      children: journal.props.children,
    })
  }

  private async getOrCreateJournal(date: Date | string) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const area = this.store.area.get()
    const journals = this.get()

    let journal = journals.find((n) => n.props.date === dateStr) as IJournalNode

    if (journal) return { isCreate: false, journal }

    journal = {
      id: uniqueId(),
      type: NodeType.JOURNAL,
      props: {
        date: dateStr,
        children: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      siteId: area.siteId,
      userId: area.userId,
      areaId: area.id,
    }

    await localDB.addJournal(journal)

    return { isCreate: true, journal }
  }
}
