import React from 'react'
import type {Timeframe} from './types'
import {generateCSV, parseCSV, transformCSV} from './utils'

interface EditUploadProps {
  file: File
  onClose: () => void
}

export const EditUpload = ({file, onClose}: EditUploadProps) => {
  const [timeframe, setTimeframe] = React.useState('all-time' as Timeframe)
  
  const startDownload = (goodreadsExport: string) => {
    const data = new Blob([goodreadsExport], {type: 'text/csv'});
    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'export.csv');
    tempLink.click();
  }

  const exportCSV = async () => {
    const libbyImport = await parseCSV(file)
    const goodreadsExport = generateCSV(transformCSV(libbyImport, timeframe))
    startDownload(goodreadsExport)
  }

  const modalStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10%',
    bottom: '10%',
    left: '10%',
    width: '80%',
    backgroundColor: 'white',
    border: '2px solid rgb(240, 240, 240)',
    borderRadius: '12px',
    boxShadow: 'rgba(100, 100, 111, 0.3) 0px 7px 29px 0px',
  }

  return (
    <div style={modalStyle}>
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