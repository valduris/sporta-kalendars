import pg from "pg";
import fs from "fs";
import path from "path";

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../config/database.json"))).development;
const connectionString = `postgres://${config.user}:${config.password}@${config.host}/${config.database}`;

export const query = (queryString, params, callback) => {
    pg.connect(connectionString, (connectionError, client, done) => {
        if (connectionError) {
            callback(connectionError);
            console.error("error fetching client from pool", connectionError);
            return;
        }
        client.query(queryString, params, (queryError, results) => {
            done();
            callback(queryError, results)
            console.log(queryError || results);
        });
    });
};
