export interface LibbyImportItem {
    title: string,
    author: string,
    publisher: string,
    isbn: string,
    activity: string
    timestamp: string
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

export interface GoodreadsExport {
    [isbn: string]: GoodreadsExportItem
  }

export type Timeframe = 'all-time' | 'last-month' | 'last-year'
