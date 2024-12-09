import {ExportRow} from './ExportRow'
import {GenericItem} from './types'

interface ExportTableProps {
  items: GenericItem[]
}

export const ExportTable = ({items}: ExportTableProps) => {
  return (
    <table>
      <thead>
        <th scope="col" aria-label='include in export'></th>
        <th scope="col">Date</th>
        <th scope="col">Title</th>
        <th scope="col">Author</th>
        <th scope="col">Goodreads shelf</th>
      </thead>
      <tbody>
        {items.map((item) => <ExportRow item={item} />)}
      </tbody>
    </table>
  )
}