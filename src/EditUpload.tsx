import React from 'react'
import {ExportTable} from './ExportTable'
import {GenericItem, GenericExportItem, Shelf, TShelf} from './types'
import {generateCSV} from './utils'

interface EditUploadProps {
  items: GenericItem[]
  onClose: () => void
}

export const EditUpload = ({items, onClose}: EditUploadProps) => {
  const initialExportItems = items.map((item) => ({...item, selected: true, filtered: false}))

  const [exportItems, setExportItems] = React.useState<GenericExportItem[]>(initialExportItems)
  const [recencyFilter, setRecencyFilter] = React.useState(6) // defaults to past 6 months
  
  const startDownload = (goodreadsExport: string) => {
    const data = new Blob([goodreadsExport], {type: 'text/csv'});
    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'export.csv');
    tempLink.click();
  }

  const exportCSV = async () => {
    const toExport = exportItems.filter((exportItem) => exportItem.selected && !exportItem.filtered)
    const goodreadsExport = generateCSV(toExport)
    startDownload(goodreadsExport)
  }

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filter = parseInt(e.target.value, 10)
    setRecencyFilter(filter)
    const cutoffDate = new Date()
    cutoffDate.setMonth(cutoffDate.getMonth() - filter)
    const filteredExportItems = exportItems.map((exportItem) => {
      return exportItem.timestamp > cutoffDate ? {...exportItem, filtered: false} : {...exportItem, filtered: true}
    })
    setExportItems(filteredExportItems)
  }

  const toggleSelection = (isbn: string) => {
    const updatedExportItems = exportItems.map((exportItem) => {
      return exportItem.isbn === isbn ? {...exportItem, selected: !exportItem.selected} : {...exportItem}
    })
    setExportItems(updatedExportItems)
  }

  const isActivity = (activity: string): activity is TShelf => {
    return Object.values(Shelf).includes(activity as TShelf)
  }

  const updateActivity = (isbn: string, activity: string) => {
    if (!isActivity(activity)) { return }
    const updatedExportItems = exportItems.map((exportItem) => {
      return exportItem.isbn === isbn ? {...exportItem, activity: activity} : {...exportItem}
    })
    setExportItems(updatedExportItems)
  }

  const toggleSelectAll = (mode: 'deselect' | 'select') => {
    setExportItems(exportItems.map((exportItem) => ({...exportItem, selected: mode === 'select' ? true : false})))
  }

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-evenly', width: '80%', margin: '2em auto'}}>
        <label>
          Filter: Past
          <input type="number" min="1" step="1" value={recencyFilter} style={{width: "2.5em", margin: "auto .5em"}} onChange={onFilterChange} />
          months
        </label>
        <button onClick={exportCSV}>Download goodreads CSV</button>
        <button onClick={onClose}>Back</button>
      </div>
      <ExportTable items={exportItems.filter((item) => !item.filtered)} toggleSelectAll={toggleSelectAll} toggleSelection={toggleSelection} updateActivity={updateActivity} />
    </>
  )
}