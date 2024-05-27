import React from 'react'
import {generateCSV, parseCSV, transformCSV} from './utils'

export default function ConversionFormComponent() {
  const [importFile, setImportFile] = React.useState<File>()

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    file ? setImportFile(file) : setImportFile(undefined)
  }

  const startDownload = (goodreadsExport: string) => {
    const data = new Blob([goodreadsExport], {type: 'text/csv'});
    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'export.csv');
    tempLink.click();
  }

  const exportCSV = async () => {
    if (!importFile) return
    const libbyImport = await parseCSV(importFile)
    const goodreadsExport = generateCSV(transformCSV(libbyImport))
    startDownload(goodreadsExport)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <input type="file" onChange={onFileChange} style={{margin: "auto", marginTop: "2em"}} />
        <button onClick={exportCSV} style={{marginTop: "2em"}}>Export</button>
    </div>
  )
}
