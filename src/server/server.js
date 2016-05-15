import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { query } from "./modules/postgres";
import { scrape, url } from "./scrapers/track-and-field/lat-athletics.lv";
import { deleteScraperData } from "./modules/scrapers";

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
    deleteScraperData(url, (deleteErr) => {
        if (deleteErr) {
            console.log("Error while deleting scraped data for URL " + url, deleteErr);
        } else {
            scrape((err, result) => {
                res.json(err || result);
            });
        }
    });
});

server.use((err, req, res, next) => {
    res.send(err.stack);
});

console.log(Date() + " Server listening on port 3333");
server.listen("3333");

export default server;
