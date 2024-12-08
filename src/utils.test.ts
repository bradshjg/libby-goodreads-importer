import {timeFormat} from 'd3-time-format'
import {GoodreadsExportItem, LibbyImportItem, Shelf} from './types'
import {transformCSV} from './utils'

const libbyData = (isbn: string, activity: string, details: string, date: Date): LibbyImportItem => {
  const dateFormatter = timeFormat('%B %d, %Y %H:%M')
  return {
    title: 'test-title',
    author: 'test-author',
    publisher: 'test-publisher',
    isbn: isbn,
    activity: activity,
    timestamp: dateFormatter(date),
    details: details,
  }
}

const goodreadsData = (isbn: string, shelves: Shelf, dateAdded: Date | undefined, dateRead: Date | undefined): GoodreadsExportItem => {
  const dateFormatter = timeFormat('%Y-%m-%d')
  return {
    Title: 'test-title',
    Author: 'test-author',
    Publisher: 'test-publisher',
    ISBN: isbn,
    "Date Added": dateAdded ? dateFormatter(dateAdded) : '',
    "Date Read": dateRead ? dateFormatter(dateRead) : '',
    Shelves: shelves,
  }
}

test('shelve borrowed books with details as currently-reading', () => {
  const today = new Date()
  expect(transformCSV([libbyData('some-isbn', 'Borrowed', 'some details', today)])).toEqual(
    [goodreadsData('some-isbn', 'currently-reading', today, undefined)]
  )
})

test('shelve borrowed books with empty details as read', () => {
  const today = new Date()
  expect(transformCSV([libbyData('some-isbn', 'Borrowed', '', today)])).toEqual(
    [goodreadsData('some-isbn', 'read', today, today)]
  )
})

test('shelve returned books as read', () => {
  const today = new Date()
  expect(transformCSV([libbyData('some-isbn', 'Returned', '', today)])).toEqual(
    [goodreadsData('some-isbn', 'read', today, today)]
  )
})

test('shelve placed on hold books as to-read', () => {
  const today = new Date()
  expect(transformCSV([libbyData('some-isbn', 'Placed on hold', '', today)])).toEqual(
    [goodreadsData('some-isbn', 'to-read', today, undefined)]
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
    [goodreadsData('some-isbn', 'read', today, today)]
  )
})

test('filters events outside timeframe', () => {
  const twoMonthsAgo = new Date()
  twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60)
  expect(
    transformCSV([
      libbyData('some-isbn', 'Borrowed', '', twoMonthsAgo),
    ])
).toEqual(
    []
  )
})

export {}