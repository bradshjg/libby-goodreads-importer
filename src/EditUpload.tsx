import React from 'react'
import {GenericItem, type Timeframe} from './types'
import {generateCSV, filterActivities} from './utils'

interface EditUploadProps {
  items: GenericItem[]
  onClose: () => void
}

export const EditUpload = ({items, onClose}: EditUploadProps) => {
  const [timeframe, setTimeframe] = React.useState('all-time' as Timeframe)

  const filteredItems = React.useMemo(
    () => {
      return filterActivities(items, timeframe)
    },
    [items, timeframe],
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
    <div>
      <ul>
        {filteredItems.map((item) => <li>{item.timestamp.toLocaleDateString()} - {item.title} - {item.activity}</li>) }
      </ul>
      <label>
        Timeframe:
        <select onChange={(e) => setTimeframe(e.target.value as Timeframe)} style={{marginLeft: '1em', marginTop: '1em'}}>
          <option value='all-time'>All time</option>
          <option value='last-year'>Last year</option>
          <option value='last-month'>Last month</option>
        </select>
      </label>
      <button onClick={exportCSV} style={{marginTop: '1em'}}>Download goodreads CSV</button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}