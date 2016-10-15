import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { fetch } from "./modules/store";
import { scrape as scrape0, url as url0 } from "./scrapers/track-and-field/lat-athletics.lv";
import { scrape as scrape1, url as url1 } from "./scrapers/beach-volleyball/fivb.org";
import { save, deleteScraperData } from './modules/store'


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
    fetch()
        .then(events => {
            res.json(events)
        })
        .catch(err => {
            res.end(err)
        })
});

// TODO create a cron job for each scraper
server.get("/run-all-scrapers", (req, res) => {
    const scrapers = [
        { scrape: scrape0, url: url0 },
        { scrape: scrape1, url: url1 }
    ];
    Promise.all(scrapers.map(({ scrape, url }) => new Promise((resolve, reject) => {
        deleteScraperData(url)
            .then(() =>{
                scrape((err, events) => {
                    save(events)
                        .then(resolve)
                        .catch(reject)
                })
            })
            .catch(err => {
                console.log("Error while deleting scraped data for URL " + url, err)
            })
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
