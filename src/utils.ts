import {parse} from 'csv-parse/browser/esm/sync'
import {stringify} from 'csv-stringify/browser/esm/sync'
import {timeFormat, timeParse} from 'd3-time-format'
import {GenericItem, GoodreadsExportItem, LibbyImportItem, Shelf, TShelf} from './types'

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
  const isValidItem = (item: object): item is LibbyImportItem => {
    return (
      'title' in item && typeof item.title === 'string' &&
      'author' in item && typeof item.author === 'string' &&
      'publisher' in item && typeof item.publisher === 'string' &&
      'isbn' in item && typeof item.isbn === 'string' &&
      'timestamp' in item && !!item.timestamp &&
      'activity' in item && typeof item.activity === 'string' &&
      'details' in item && typeof item.details === 'string'
    )
  }
  const importCSVText = await readFile(importFile) as string
  const raw = parse(importCSVText, {columns: true, skip_empty_lines: true}) as object[]
  const libbyItems = raw.map((item) => {
    if (!("timestamp" in item && typeof item.timestamp === 'string')) { return {} }
    return {...item, timestamp: dateParser(item.timestamp)}
  }).filter((item): item is LibbyImportItem => isValidItem(item))
  return libbyItems
}

const dateParser = timeParse('%B %d, %Y %H:%M')
const dateFormatter = timeFormat('%Y-%m-%d')

const getActivity = (libbyItem: LibbyImportItem): TShelf | undefined => {
  let activity: TShelf | undefined
  switch (libbyItem['activity']) {
    case 'Borrowed':
      if (!!libbyItem['details']) {
        activity = Shelf.CurrentlyReading
      } else {
        activity = Shelf.Read
      }
      break;
    case 'Returned':
      activity = Shelf.Read
      break;
    case 'Placed on hold':
      activity = Shelf.ToRead
      break;
  }
  return activity
}

const getGenericItem = (libbyItem: LibbyImportItem): GenericItem | undefined => {
  const activity = getActivity(libbyItem)
  if (!activity) { return}

  const item: GenericItem = {
    timestamp: libbyItem['timestamp'],
    activity: activity,
    title: libbyItem['title'],
    author: libbyItem['author'],
    publisher: libbyItem['publisher'],
    isbn: libbyItem['isbn'],
  }
  return item
}

const getGoodReadsItem = (genericItem: GenericItem): GoodreadsExportItem => {
  const formattedDate = dateFormatter(genericItem.timestamp)
  return {
    Title: genericItem.title,
    Author: genericItem.author,
    Publisher: genericItem.publisher,
    ISBN: genericItem.isbn,
    Shelves: genericItem.activity,
    "Date Added": formattedDate,
    "Date Read": genericItem.activity === Shelf.Read ? formattedDate : '',
  }
}

export const transformCSV = (libbyImportItems: LibbyImportItem[]): GenericItem[] => {
  const genericItems = libbyImportItems.map(getGenericItem).filter((item): item is GenericItem => !!item)
  const sortedGenericItems = genericItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const seenISBNs = new Set()
  const lastEventGenericItems: GenericItem[] = []

  for (const item of sortedGenericItems) {
    if (!seenISBNs.has(item.isbn)) {
      lastEventGenericItems.push(item);
      seenISBNs.add(item.isbn);
    }
  }
  return lastEventGenericItems
}

export const generateCSV = (genericItems: GenericItem[]) => {
  return stringify(
    genericItems.map(getGoodReadsItem),
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