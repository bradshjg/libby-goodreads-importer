import {GenericItem, Shelf} from './types'

interface ExportRowProps {
  item: GenericItem
}

export const ExportRow = ({item}: ExportRowProps) => {
  return (
    <tr>
      <td><input type="checkbox" /></td>
      <td>{item.timestamp.toLocaleDateString()}</td>
      <td>{item.title}</td>
      <td>{item.author}</td>
      <td>
        <select value={item.activity}>
          {Object.values(Shelf).map((shelf) => <option>{shelf}</option>)}
        </select>
      </td>
    </tr>
  )
}