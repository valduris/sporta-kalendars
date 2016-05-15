import async from "async";
import { query } from "./postgres";

export const storeEvents = (events, insertsCallback) => {
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
        }

        insertsCallback(err, results);
    });
};