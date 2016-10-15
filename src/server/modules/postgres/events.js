import async from "async";
import { query } from "./postgres";

export function save (events) {
    let resolve = null
    let reject = null
    const promise = new Promise((y, n) => {
        resolve = y
        reject = n
    })

    // TODO make multi-insert query builder helper function or write pgpsql proc for inserting multiple events at once
    const queryString = "INSERT INTO events (title, start_time, end_time, place, category, scraped_from, attributes) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    let callbacks = []; // insert queries to execute in parallel

    events.forEach(event => {
        callbacks.push((asyncCallback) => {
            let params = [
                event.title,
                event.start_time,
                event.end_time,
                event.place,
                event.category,
                event.scraped_from,
                JSON.stringify(event.attributes)
            ];
            query(queryString, params, (insertError, insertResult) => {
                asyncCallback(insertError, insertResult);
            });
        });
    });

    async.parallel(callbacks, (err, results) => {
        if (err) {
            // TODO proper error handling
            console.log("Error while saving events", err);
            reject(err)
            return
        }

        resolve(results)
    });

    return promise
}

export function fetch () {
  return new Promise((resolve, reject) => {
    query('SELECT title, start_time as start, end_time as end FROM events', [], (queryError, result) => {
      if (queryError) {
        reject(queryError)
      } else {
        resolve(result.rows)
      }
    })
  })
}
