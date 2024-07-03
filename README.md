# Libby -> Goodreads

Visit https://bradshjg.github.io/libby-goodreads-importer/ and follow the instructions to transfer Libby activity data into Goodreads.

> No user data is collected, the conversion happens client-side.

## Notes

The heuristics used to shelve books in GoodReads are based on the most recent event (within the timeframe) for the ISBN:

* Returned books are "read".
* Books placed on hold are "to-read".
* Books actively checked out are "currently-reading".

## Development

* `npm start` to run the dev server!
* `npm test` to run the tests!

## Deployment

`npm run build` to generate the distribution, will deploy when pushed/merged to `main`.
