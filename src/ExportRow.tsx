import {GenericExportItem, Shelf} from './types'

interface ExportRowProps {
  item: GenericExportItem
  toggleSelection: (isbn: string) => void
  updateActivity: (isbn: string, activity: string) => void
}

export const ExportRow = ({item, toggleSelection, updateActivity}: ExportRowProps) => {
  return (
    <tr onClick={() => toggleSelection(item.isbn)}>
      <td><input type="checkbox" checked={item.selected} readOnly={true} /></td>
      <td>{item.timestamp.toLocaleDateString()}</td>
      <td>{item.title}</td>
      <td>{item.author}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <select value={item.activity} onChange={(e) => updateActivity(item.isbn, e.target.value)}>
          {Object.values(Shelf).map((shelf) => <option key={shelf}>{shelf}</option>)}
        </select>
      </td>
    </tr>
  )
}