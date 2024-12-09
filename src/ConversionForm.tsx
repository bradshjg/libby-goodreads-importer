import React from 'react'
import { FileUpload } from './FileUpload'
import { EditUpload } from './EditUpload'
import { GenericItem } from './types'
import {parseCSV, transformCSV} from './utils'

interface libbyImport {
  file: File
  items: GenericItem[]
}

export default function ConversionForm() {
  const [libbyImport, setLibbyImport] = React.useState<libbyImport>()

  const onFileChange = async (file: File | undefined) => {
    if (!file) { setLibbyImport(undefined); return }
    const libbyImport = await parseCSV(file)
    setLibbyImport({file: file, items: transformCSV(libbyImport)})
  }

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      { libbyImport ?
        <EditUpload key={libbyImport.file.name} items={libbyImport.items} onClose={() => onFileChange(undefined)} />
        :
        <FileUpload onFileChange={onFileChange} />
      }
    </div>
  )
}
