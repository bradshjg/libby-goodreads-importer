import React from 'react'
import {ExportTable} from './ExportTable'
import {GenericItem} from './types'
import {generateCSV, filterActivities} from './utils'

interface EditUploadProps {
  items: GenericItem[]
  onClose: () => void
}

export const EditUpload = ({items, onClose}: EditUploadProps) => {
  const [recencyFilter, setRecencyFilter] = React.useState(6) // defaults to past 6 months

  const filteredItems = React.useMemo(
    () => {
      return filterActivities(items, recencyFilter)
    },
    [items, recencyFilter],
  )
  
  const startDownload = (goodreadsExport: string) => {
    const data = new Blob([goodreadsExport], {type: 'text/csv'});
    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'export.csv');
    tempLink.click();
  }

  const exportCSV = async () => {
    const goodreadsExport = generateCSV(items)
    startDownload(goodreadsExport)
  }

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-evenly', width: '80%', margin: '2em auto'}}>
        <label>
          Filter: Past
          <input type="number" min="1" step="1" style={{width: "2.5em", margin: "auto .5em"}}onChange={(e) => setRecencyFilter(parseInt(e.target.value, 10))} />
          months
        </label>
        <button onClick={exportCSV}>Download goodreads CSV</button>
        <button onClick={onClose}>Back</button>
      </div>
      <ExportTable items={filteredItems} />
    </>
  )
}