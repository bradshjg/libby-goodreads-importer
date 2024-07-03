export interface LibbyImportItem {
  title: string,
  author: string,
  publisher: string,
  isbn: string,
  activity: string
  timestamp: string
  details?: string
}

export enum Activity {
  ToRead = 'to-read',
  CurrentlyReading = 'currently-reading',
  Read = 'read',
}

export interface GenericItem {
  timestamp: Date,
  activity: Activity,
  title: string,
  author: string,
  publisher: string,
  isbn: string,
}

export type Shelf = 'to-read' | 'currently-reading' | 'read'

export interface GoodreadsExportItem {
  Title: string
  Author: string
  Publisher: string
  ISBN: string
  "Date Added": string
  "Date Read": string
  Shelves: Shelf
}

export type Timeframe = 'all-time' | 'last-month' | 'last-year'
