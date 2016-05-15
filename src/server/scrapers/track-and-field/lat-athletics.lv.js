import Xray from "x-ray";
import { storeEvents } from "../../modules/events";

const xray = Xray();

const parseDateTime = (dateTimeString) => {
    if (!dateTimeString) {
        return;
    }
    const parts = dateTimeString.split("/");

    return new Date(parts[2], parts[1] - 1, parts[0]).toUTCString();
};

export const url = "http://lat-athletics.lv/lv/events";

export const scrape = (resultsScrapedCallback) => {
    xray(url, ".dates-container", {
        events: xray(".event-entry", [{
            title: ".to-event",
            dates: ".date",
            place: ".place"
        }])
    })((err, data) => {
        if (err) {
            // send e-mail about error
            console.log("Error while scraping data from " + url, err.stack);
            return;
        }

        data.events.forEach(event => {
            const dates = event.dates.split("-");
            delete event.dates;
            event.scraped_from = url;
            event.category = "Vieglatlētika";
            event.start_time = parseDateTime(dates[0].trim());
            event.end_time = parseDateTime(dates[1].trim());
            event.attributes = {};
        });

        storeEvents(data.events, (error, result) => {
            resultsScrapedCallback(error, result);
        });
    });
}