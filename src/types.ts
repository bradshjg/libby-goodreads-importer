export interface LibbyImportItem {
  title: string,
  author: string,
  publisher: string,
  isbn: string,
  timestamp: Date
  activity: string
  details: string
}

export interface GenericItem {
  timestamp: Date,
  activity: TShelf,
  title: string,
  author: string,
  publisher: string,
  isbn: string,
}

export interface GenericExportItem extends GenericItem {
  selected: boolean
  filtered: boolean
}

export const Shelf = {
  ToRead: 'to-read',
  CurrentlyReading: 'currently-reading',
  Read: 'read'
} as const

export type TShelf = typeof Shelf[keyof typeof Shelf]

export interface GoodreadsExportItem {
  Title: string
  Author: string
  Publisher: string
  ISBN: string
  "Date Added": string
  "Date Read": string
  Shelves: TShelf
}
