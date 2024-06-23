export interface LibbyImportItem {
    title: string,
    author: string,
    publisher: string,
    isbn: string,
    activity: string
    timestamp: string
    details?: string
  }

export interface GoodreadsExportItem {
    Title: string
    Author: string
    Publisher: string
    ISBN: string
    "Date Added"?: string
    "Date Read"?: string
    Shelves?: string
  }

export interface LibbyImport {
    [isbn: string]: LibbyImportItem
  }

export type Timeframe = 'all-time' | 'last-month' | 'last-year'
