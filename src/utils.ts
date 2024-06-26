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
  const formattedActivityDate = dateFormatter(activityDate)
  const goodReadsItem: GoodreadsExportItem = {
    'Title': libbyItem['title'],
    'Author': libbyItem['author'],
    'Publisher': libbyItem['publisher'],
    'ISBN': libbyItem['isbn'],
  }
  switch (libbyItem['activity']) {
    case 'Borrowed':
      if (libbyItem['details'] === '') {
        goodReadsItem['Shelves'] = 'read'
        goodReadsItem['Date Read'] = formattedActivityDate
      } else {
        goodReadsItem['Shelves'] = 'currently-reading'
        goodReadsItem['Date Added'] = formattedActivityDate
      }
      break;
    case 'Returned':
      goodReadsItem['Shelves'] = 'read'
      goodReadsItem['Date Read'] = formattedActivityDate
      break;
    case 'Placed on hold':
      goodReadsItem['Shelves'] = 'to-read'
      goodReadsItem['Date Added'] = formattedActivityDate
      break;
  }
  return goodReadsItem
}

function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value
}

function getCutoffDate(timeframe?: Timeframe): Date | undefined {
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
  return cutoff
}

export const transformCSV = (libbyImportItems: LibbyImportItem[], timeframe?: Timeframe) => {
    const cutoff = getCutoffDate(timeframe)
    const cutoffFilter = (item: LibbyImportItem) => {
      const timestamp = dateParser(item.timestamp)
      if (!timestamp) return false
      if (!cutoff) return true
      return timestamp > cutoff
    }
    const eventFilter = (item: LibbyImportItem) => {
      return ['Returned', 'Borrowed', 'Placed on hold'].includes(item.activity)
    }
    const filteredLibbyImportItems = libbyImportItems.filter((item) => {
      return cutoffFilter(item) && eventFilter(item)
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