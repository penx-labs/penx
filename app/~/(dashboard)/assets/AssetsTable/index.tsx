import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { cellRenderers } from '@/components/cells'
import { FileCell } from '@/components/cells/file-cell'
import { SystemDateCell } from '@/components/cells/system-date-cell'
import { getDataEditorTheme } from '@/lib/getDataEditorTheme'
import { Asset } from '@/lib/hooks/useAssets'
import DataEditor, {
  DataEditorProps,
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridCellKind,
  Item,
  type GridColumn,
} from '@glideapps/glide-data-grid'

const defaultProps: Partial<DataEditorProps> = {
  smoothScrollX: true,
  smoothScrollY: true,
  getCellsForSelection: true,
  width: '100%',
  height: '100%',
}

export interface AssetsTableProps {
  assets: Asset[]
}

interface IColumns {
  title: string
  id: string
  hasMenu?: boolean
  dataType?: 'Bubble' | 'Image' | 'DatePicker' | 'Number' | 'SingleDropdown'
  width?: number
}

export function AssetsTable({ assets }: AssetsTableProps) {
  const { theme } = useTheme()

  const initialColumns = [
    {
      title: 'Asset',
      id: 'asset',
      hasMenu: false,
    },
    {
      title: 'filename',
      id: 'name',
      hasMenu: false,
    },
    {
      title: 'Type',
      id: 'contentType',
      hasMenu: false,
    },
    {
      title: 'Public',
      id: 'isPublic',
      hasMenu: false,
    },
    {
      title: 'Size',
      id: 'size',
      hasMenu: false,
    },
    {
      title: 'Created At',
      id: 'createdAt',
      hasMenu: false,
    },
  ]

  const [numRows, setNumRows] = useState<number>(assets.length)
  const [columns, setColumns] = useState<IColumns[]>(initialColumns)

  const ref = useRef<DataEditorRef>(null)

  const getContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell
      const asset = assets[row]
      const url = `/asset/${asset.url}`

      if (col === 0) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          readonly: true,
          copyData: '',
          data: {
            kind: 'file-cell',
            url,
            name: asset.filename,
          },
        } as FileCell
      }

      if (col === 1) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: false,
          readonly: true,
          displayData: asset.filename || asset.title || '',
          data: asset.filename || asset.title || '',
        }
      }

      if (col === 2) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: false,
          readonly: true,
          displayData: asset.contentType,
          data: asset.contentType,
        }
      }

      if (col === 3) {
        return {
          kind: GridCellKind.Boolean,
          allowOverlay: false,
          readonly: false,
          data: !!asset.isPublic,
        }
      }

      if (col === 4) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: false,
          readonly: true,
          displayData: asset.size?.toString() || '',
          data: asset.size?.toString() || '',
        }
      }

      if (col === 5) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          readonly: true,
          copyData: '',
          data: {
            kind: 'system-date-cell',
            data: asset.createdAt,
          },
        } as SystemDateCell
      }

      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: true,
        displayData: '',
        data: '',
      }
    },
    [columns],
  )

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        // we only have text cells, might as well just die here.
        return
      }
      // not support edite yet
      return
    },
    [columns],
  )

  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    setColumns((preColumns) => {
      const index = preColumns.findIndex((ci) => ci.id === column.id)
      const newArray = [...preColumns]
      newArray.splice(index, 1, {
        ...preColumns[index],
        width: newSize,
      })

      return newArray
    })
  }, [])

  // useEffect(() => {
  //   setNumRows(spaceNodes.length)
  // }, [spaceNodes])

  const isDark = theme === 'dark'
  return (
    <div
      className="px-4"
      style={{
        height: 'calc(100vh - 56px)',
      }}
    >
      <DataEditor
        className="rounded-lg overflow-hidden bg-transparent"
        {...defaultProps}
        ref={ref}
        customRenderers={cellRenderers}
        columns={columns}
        getCellContent={getContent}
        theme={getDataEditorTheme(isDark)}
        onCellEdited={onCellEdited}
        rowMarkers={'both'}
        onColumnResize={onColumnResize}
        rows={numRows}
      />
    </div>
  )
}
