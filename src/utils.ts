import {parse} from 'csv-parse/browser/esm/sync'
import {stringify} from 'csv-stringify/browser/esm/sync'
import {timeFormat, timeParse} from 'd3-time-format'
import {Activity, GenericItem, GoodreadsExportItem, LibbyImportItem} from './types'

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

const getActivity = (libbyItem: LibbyImportItem): Activity | undefined => {
  let activity: Activity | undefined
  switch (libbyItem['activity']) {
    case 'Borrowed':
      if (!!libbyItem['details']) {
        activity = Activity.CurrentlyReading
      } else {
        activity = Activity.Read
      }
      break;
    case 'Returned':
      activity = Activity.Read
      break;
    case 'Placed on hold':
      activity = Activity.ToRead
      break;
  }
  return activity
}

const getGenericItem = (libbyItem: LibbyImportItem): GenericItem | undefined => {
  const activityDate = dateParser(libbyItem.timestamp)
  if (!activityDate) { return }
  const activity = getActivity(libbyItem)
  if (!activity) { return}

  const item: GenericItem = {
    timestamp: activityDate,
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
    "Date Read": genericItem.activity === Activity.Read ? formattedDate : '',
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

export const filterActivities = (genericItems: GenericItem[], recencyFilter: number) => {
  const cutoffDate = new Date()
  cutoffDate.setMonth(cutoffDate.getMonth() - recencyFilter)
  return genericItems.filter((item) => item.timestamp > cutoffDate)
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