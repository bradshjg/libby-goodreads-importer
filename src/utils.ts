import {parse} from 'csv-parse/browser/esm/sync'
import {stringify} from 'csv-stringify/browser/esm/sync'
import {timeFormat, timeParse} from 'd3-time-format'
import type {GoodreadsExportItem, LibbyImport, LibbyImportItem, Timeframe} from './types'

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

const dateParser = timeParse('%B %d, %Y %H:%M')
const dateFormatter = timeFormat('%Y-%m-%d')

const convertLibbyImportItem = (libbyItem: LibbyImportItem) => {
  const activityDate = dateParser(libbyItem.timestamp)
  if (!activityDate) return
  if (libbyItem['activity'] !== 'Borrowed' && libbyItem['activity'] !== 'Returned') return
  const formattedActivityDate = dateFormatter(activityDate)
  const goodReadsItem: GoodreadsExportItem = {
    'Title': libbyItem['title'],
    'Author': libbyItem['author'],
    'Publisher': libbyItem['publisher'],
    'ISBN': libbyItem['isbn'],
  }
  if (libbyItem['activity'] === 'Borrowed' && libbyItem['details'] !== '') {
    goodReadsItem['Shelves'] = 'currently-reading'
    goodReadsItem['Date Added'] = formattedActivityDate
  }
  if (libbyItem['activity'] === 'Returned' || (libbyItem['activity'] === 'Borrowed' && libbyItem['details'] === '')) {
    goodReadsItem['Shelves'] = 'read'
    goodReadsItem['Date Read'] = formattedActivityDate
  }
  return goodReadsItem
}

export function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value
}

export const transformCSV = (libbyImportItems: LibbyImportItem[], timeframe?: Timeframe) => {
    let cutoff: Date | undefined = new Date()
    switch(timeframe) {
      case 'all-time':
        cutoff = undefined
        break;
      case 'last-year':
        cutoff.setDate(cutoff.getDate() - 365)
        break;
      case 'last-month':
        cutoff.setMonth(cutoff.getMonth() - 1)
        break;
      default:
        cutoff = undefined
    }
    const filteredLibbyImportItems = libbyImportItems.filter((item) => {
      const timestamp = dateParser(item.timestamp)
      if (!timestamp) return false
      if (!cutoff) return true
      return timestamp > cutoff
    })
    const sortedLibbyImportItems = [...filteredLibbyImportItems].sort((a, b) => {
      const aTimestamp = dateParser(a.timestamp) as Date
      const bTimestamp = dateParser(b.timestamp) as Date
      return aTimestamp < bTimestamp ? -1 : 1
    })

    // last event wins!
    const libbyImport: LibbyImport = {}
    for (const item of sortedLibbyImportItems) {
      if (!item.isbn) continue
      libbyImport[item.isbn] = item
    }
    return Object.values(libbyImport).map(convertLibbyImportItem).filter(isTruthy)
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