import {ExportRow} from './ExportRow'
import {GenericExportItem} from './types'

interface ExportTableProps {
  items: GenericExportItem[]
  toggleSelectAll: (mode: 'select' | 'deselect') => void
  toggleSelection: (isbn: string) => void
  updateActivity: (isbn: string, activity: string) => void
}

export const ExportTable = ({items, toggleSelectAll, toggleSelection, updateActivity}: ExportTableProps) => {
  const allSelected = !items.some((item) => !item.selected)

  const onSelectAllChange = () => {
    const mode = allSelected ? 'deselect' : 'select'
    toggleSelectAll(mode)
  }

  return (
    <table>
      <thead>
        <tr>
          <th scope="col" aria-label='include in export'><input type="checkbox" checked={allSelected} onChange={onSelectAllChange}/></th>
          <th scope="col">Date</th>
          <th scope="col">Title</th>
          <th scope="col">Author</th>
          <th scope="col">Shelf</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => <ExportRow key={item.isbn} item={item} toggleSelection={toggleSelection} updateActivity={updateActivity} />)}
      </tbody>
    </table>
  )
}