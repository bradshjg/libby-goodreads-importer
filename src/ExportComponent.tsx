import React from 'react'
import {parse} from 'csv-parse'
import {generate} from 'csv-generate'

type TimeFrame = 'all' | 'month' | 'year'

export default function ExportComponent() {
  const [importFile, setImportFile] = React.useState<File>()
  const [timeframe, setTimeframe] = React.useState<TimeFrame>('all')

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    file ? setImportFile(file) : setImportFile(undefined)
  }

  const exportCSV = () => {
    console.log("generating export...")
    console.log(timeframe)
    console.log(importFile)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <input type="file" onChange={onFileChange} style={{margin: "auto", marginTop: "2em"}} />
        <select onChange={(e) => setTimeframe(e.target.value as TimeFrame)} style={{marginTop: "2em"}}>
            <option value='all'>All time</option>
            <option value='month'>Last month</option>
            <option value='year'>Last year</option>
        </select>
        <button onClick={exportCSV} style={{marginTop: "2em"}}>Export</button>
    </div>
  )
}
