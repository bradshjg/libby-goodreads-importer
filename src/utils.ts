import {parse} from 'csv-parse/browser/esm/sync'
import {stringify} from 'csv-stringify/browser/esm/sync'
import {timeFormat, timeParse} from 'd3-time-format'
import type {LibbyImportItem, GoodreadsExport, GoodreadsExportItem} from './types'

export const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();  
      fr.onload = () => {
        resolve(fr.result as String)
      };
      fr.onerror = reject;
      fr.readAsText(file);
    });
  }

export const parseCSV = async (importFile: File) => {
    const importCSVText = await readFile(importFile) as string
    return parse(importCSVText, {columns: true, skip_empty_lines: true}) as LibbyImportItem[]
  }

export const transformCSV = (libbyImport: LibbyImportItem[]) => {
    const goodreadsExport: GoodreadsExport = {}
    for (const libbyItem of libbyImport) {
      const dateParser = timeParse('%B %d, %Y %H:%M')
      const dateFormatter = timeFormat('%Y-%m-%d')
      const activityDate = dateParser(libbyItem.timestamp)
      if (!activityDate) continue
      const isbn = libbyItem['isbn']
      const formattedActivityDate = dateFormatter(activityDate)
      const item = goodreadsExport[isbn] || {
        'Title': libbyItem['title'],
        'Author': libbyItem['author'],
        'Publisher': libbyItem['publisher'],
        'ISBN': libbyItem['isbn'],
      }
      if (libbyItem['activity'] === 'Borrowed') {
        item['Date Added'] = formattedActivityDate
        if (item['Shelves'] !== 'read') {
          item['Shelves'] = 'currently-reading'
        }
      }
      if (libbyItem['activity'] === 'Returned') {
        item['Date Added'] = formattedActivityDate
        item['Shelves'] = 'read'
      }
      goodreadsExport[isbn] = item
    }
    return Object.values(goodreadsExport)
  }

export const generateCSV = (goodreadsExport: GoodreadsExportItem[]) => {
    return stringify(
      goodreadsExport,
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
  }