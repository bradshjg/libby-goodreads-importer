import React from 'react'
import {generateCSV, parseCSV, transformCSV} from './utils'
import { FileUpload } from './FileUpload'

export default function ConversionForm() {
  const [importFile, setImportFile] = React.useState<File>()

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
    const goodreadsExport = generateCSV(transformCSV(libbyImport))
    startDownload(goodreadsExport)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <p>
            <ol>
                <li><a href="https://help.libbyapp.com/en-us/6207.htm">Download Libby activity CSV</a></li>
                <li>Convert to goodreads format</li>
                <li><a href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590">Import into goodreads</a></li>
            </ol>
        </p>
        <FileUpload onFileChange={setImportFile}/>
        <button onClick={exportCSV} style={{marginTop: '2em'}}>Download goodreads CSV</button>
    </div>
  )
}
