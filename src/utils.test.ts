import {GenericItem, LibbyImportItem, TShelf} from './types'
import {transformCSV} from './utils'

const libbyData = (isbn: string, activity: string, details: string, date: Date): LibbyImportItem => {
  return {
    title: 'test-title',
    author: 'test-author',
    publisher: 'test-publisher',
    isbn: isbn,
    activity: activity,
    timestamp: date,
    details: details,
  }
}

const genericData = (isbn: string, activity: TShelf, timestamp: Date): GenericItem => {
  return {
    title: 'test-title',
    author: 'test-author',
    publisher: 'test-publisher',
    isbn: isbn,
    timestamp: timestamp,
    activity: activity,
  }
}

test('shelve borrowed books with details as currently-reading', () => {
  const today = new Date()
  expect(transformCSV([libbyData('some-isbn', 'Borrowed', 'some details', today)])).toEqual(
    [genericData('some-isbn', 'currently-reading', today)]
  )
})

test('shelve borrowed books with empty details as read', () => {
  const today = new Date()
  expect(transformCSV([libbyData('some-isbn', 'Borrowed', '', today)])).toEqual(
    [genericData('some-isbn', 'read', today)]
  )
})

test('shelve returned books as read', () => {
  const today = new Date()
  expect(transformCSV([libbyData('some-isbn', 'Returned', '', today)])).toEqual(
    [genericData('some-isbn', 'read', today)]
  )
})

test('shelve placed on hold books as to-read', () => {
  const today = new Date()
  expect(transformCSV([libbyData('some-isbn', 'Placed on hold', '', today)])).toEqual(
    [genericData('some-isbn', 'to-read', today)]
  )
})

test('most recent event wins', () => {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  expect(transformCSV([
    libbyData('some-isbn', 'Borrowed', '', today),
    libbyData('some-isbn', 'Placed on hold', '', yesterday)
  ])).toEqual(
    [genericData('some-isbn', 'read', today)]
  )
})

export {}