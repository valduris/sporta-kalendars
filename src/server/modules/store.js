const USE_POSTGRES = process.argv[2] !== 'nedb'
console.log(`Store: ${USE_POSTGRES ? 'postgres' : 'nedb'}`)

export const fetch = USE_POSTGRES ? require('./postgres/events').fetch : require('./nedb/index').fetch
export const save = USE_POSTGRES ? require('./postgres/events').save : require('./nedb/index').save
export const deleteScraperData = USE_POSTGRES ? require('./postgres/scrapers').deleteScraperData : require('./nedb/index').deleteScraperData
