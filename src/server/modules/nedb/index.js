import Datastore from 'nedb'
const db = new Datastore({
  filename: './data',
  autoload: true
})

export function fetch () {
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) {
        reject(err)
      } else {
        resolve(docs.map(doc => Object.assign({}, doc, {
          start: doc.start_time,
          end: doc.end_time
        })))
      }
    })
  })
}

export function save (events) {
  return new Promise((resolve, reject) => {
    db.insert(events, (err, docs) => {
      if (err) {
        reject(err)
      } else {
        resolve(docs)
      }
    })
  })
}

export function deleteScraperData (url) {
  return new Promise((resolve, reject) => {
    db.remove({ scraped_from: url }, { multi: true }, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
