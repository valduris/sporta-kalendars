import { query } from "./postgres";

export const deleteScraperData = (scraperUrl, callback) => {
    query("DELETE FROM events where scraped_from = $1", [scraperUrl], (err, result) => {
        callback(err, result);
    });
};
