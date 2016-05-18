import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { query } from "./modules/postgres";
import { scrape as scrape0, url as url0 } from "./scrapers/track-and-field/lat-athletics.lv";
import { scrape as scrape1, url as url1 } from "./scrapers/beach-volleyball/fivb.org";
import { deleteScraperData } from "./modules/scrapers";
import { storeEvents } from "./modules/events";


const server = express();

server.set("views", __dirname);
server.set("view engine", "jade");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.resolve(__dirname, "../../dist")));

server.get("/", (req, res) => {
    res.render("index");
});

server.get("/fetch-events", (req, res) => {
    query("SELECT title, start_time as start, end_time as end FROM events", [], (queryError, result) => {
        res.json(queryError || result.rows);
    });
});

// TODO create a cron job for each scraper
server.get("/run-all-scrapers", (req, res) => {
    const scrapers = [
        { scrape: scrape0, url: url0 },
        { scrape: scrape1, url: url1 }
    ];
    Promise.all(scrapers.map(({ scrape, url }) => new Promise((resolve, reject) => {
        deleteScraperData(url, (deleteErr) => {
            if (deleteErr) {
                console.log("Error while deleting scraped data for URL " + url, deleteErr);
            } else {
                scrape((err, events) => {
                    storeEvents(events, (error, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
            }
        });
    }))).then(results => {
        res.json(results);
    })
    .catch(err => {
        res.json(err);
    });
});

server.use((err, req, res, next) => {
    res.send(err.stack);
});

console.log(Date() + " Server listening on port 3333");
server.listen("3333");

export default server;
