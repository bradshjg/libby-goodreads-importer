import {GenericExportItem, Shelf} from './types'

interface ExportRowProps {
  item: GenericExportItem
  toggleSelection: (isbn: string) => void
  updateActivity: (isbn: string, activity: string) => void
}

export const ExportRow = ({item, toggleSelection, updateActivity}: ExportRowProps) => {
  return (
    <tr>
      <td><input type="checkbox" checked={item.selected} onChange={() => toggleSelection(item.isbn)} /></td>
      <td>{item.timestamp.toLocaleDateString()}</td>
      <td>{item.title}</td>
      <td>{item.author}</td>
      <td>
        <select value={item.activity} onChange={(e) => updateActivity(item.isbn, e.target.value)}>
          {Object.values(Shelf).map((shelf) => <option key={shelf}>{shelf}</option>)}
        </select>
      </td>
    </tr>
  )
}