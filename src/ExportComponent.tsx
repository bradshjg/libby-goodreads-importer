import React from 'react'
import {parse} from 'csv-parse/browser/esm/sync'
import {stringify} from 'csv-stringify/browser/esm/sync'
import {timeFormat, timeParse} from 'd3-time-format'

interface LibbyImportItem {
  title: string,
  author: string,
  publisher: string,
  isbn: string,
  activity: string
  timestamp: string
}
interface GoodreadsExportItem {
  Title: string
  Author: string
  Publisher: string
  ISBN: string
  "Date Added"?: string
  "Date Read"?: string
  Shelves?: string
}
interface GoodreadsExport {
  [isbn: string]: GoodreadsExportItem
}

export default function ExportComponent() {
  const [importFile, setImportFile] = React.useState<File>()

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    file ? setImportFile(file) : setImportFile(undefined)
  }

  const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();  
      fr.onload = () => {
        resolve(fr.result as String)
      };
      fr.onerror = reject;
      fr.readAsText(file);
    });
  }

  const exportCSV = async () => {
    if (!importFile) return
    const importCSVText = await readFile(importFile) as string
    const libbyImport = parse(importCSVText, {columns: true, skip_empty_lines: true}) as LibbyImportItem[]
    const goodreadsExport: GoodreadsExport = {}
    for (const libbyItem of libbyImport) {
      const dateParser = timeParse('%B %d, %Y %H:%M')
      const dateFormatter = timeFormat('%Y-%m-%d')
      const activityDate = dateParser(libbyItem.timestamp)
      if (!activityDate) continue
      const isbn = libbyItem['isbn']
      const item = goodreadsExport[isbn] || {
        'Title': libbyItem['title'],
        'Author': libbyItem['author'],
        'Publisher': libbyItem['publisher'],
        'ISBN': libbyItem['isbn'],
      }
      let goodreadsItem: GoodreadsExportItem = item
      if (libbyItem['activity'] === 'Borrowed') {
        goodreadsItem = Object.assign(item, {
            'Date Added': dateFormatter(activityDate),
            'Shelves': 'currently-reading'
        })
      }
      if (libbyItem['activity'] === 'Returned')
        goodreadsItem = Object.assign(item, {
          'Date Read': dateFormatter(activityDate),
          'Shelves': 'read'
        })
      if (goodreadsItem) goodreadsExport[isbn] = goodreadsItem
    }
    const goodreadsExportValues = Object.values(goodreadsExport)
    const csvExport = stringify(
      goodreadsExportValues,
      {
        header: true,
        columns: [
          'Title',
          'Author',
          'ISBN',
          'My Rating',
          'Average Rating',
          'Publisher',
          'Binding',
          'Year Published',
          'Original Publication Year',
          'Date Read',
          'Date Added',
          'Shelves',
          'Bookshelves',
          'My Review'
        ]
      }
    )
    var data = new Blob([csvExport], {type: 'text/csv'});
    var csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'export.csv');
    tempLink.click();
  }

  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <input type="file" onChange={onFileChange} style={{margin: "auto", marginTop: "2em"}} />
        <button onClick={exportCSV} style={{marginTop: "2em"}}>Export</button>
    </div>
  )
}
