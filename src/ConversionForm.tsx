import React from 'react'
import type {Timeframe} from './types'
import {generateCSV, parseCSV, transformCSV} from './utils'
import { FileUpload } from './FileUpload'

export default function ConversionForm() {
  const [importFile, setImportFile] = React.useState<File>()
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
    console.log(importFile)
    if (!importFile) return
    const libbyImport = await parseCSV(importFile)
    const goodreadsExport = generateCSV(transformCSV(libbyImport, timeframe))
    startDownload(goodreadsExport)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <ol>
        <li><a href="https://help.libbyapp.com/en-us/6207.htm">Download Libby activity CSV</a></li>
        <li>Convert to goodreads format (below)</li>
        <li><a href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590">Import into goodreads</a></li>
      </ol>
      <FileUpload onFileChange={setImportFile}/>
      <label>
        Timeframe:
        <select onChange={(e) => setTimeframe(e.target.value as Timeframe)} style={{marginLeft: '1em', marginTop: '1em'}}>
          <option value='all-time'>All time</option>
          <option value='last-year'>Last year</option>
          <option value='last-month'>Last month</option>
        </select>
      </label>
      <button onClick={exportCSV} style={{marginTop: '1em'}}>Download goodreads CSV</button>
    </div>
  )
}
