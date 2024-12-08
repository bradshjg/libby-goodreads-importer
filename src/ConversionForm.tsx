import React from 'react'
import { createPortal } from 'react-dom'
import { FileUpload } from './FileUpload'
import { EditUpload } from './EditUpload'

export default function ConversionForm() {
  const [importFile, setImportFile] = React.useState<File>()

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <ol>
        <li><a href="https://help.libbyapp.com/en-us/6207.htm">Download Libby activity CSV</a></li>
        <li>Convert to goodreads format (below)</li>
        <li><a href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590">Import into goodreads</a></li>
      </ol>
      <FileUpload key={importFile?.name} file={importFile} onFileChange={setImportFile} />
      { importFile && createPortal(
        <EditUpload key={importFile?.name} file={importFile} onClose={() => setImportFile(undefined)} />,
        document.body
      )}
    </div>
  )
}
