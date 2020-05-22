const express = require("express");
const sqlite3 = require("sqlite3");
const querystring = require("querystring");
const URL = require("url").URL;

const db = new sqlite3.Database(":memory");

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS notifications(name text)", (err) => {
        console.log(err);
    });
});

db.run("INSERT INTO notifications VALUES ('Amayas')");

const PORT = 8080;
const HOSTNAME = "192.168.64.2";

function getQueryParams(url) {
    return querystring.parse(new URL('http://' + HOSTNAME + url).search.slice(1));
}

function setHeaders(res) {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.setHeader("Access-Control-Allow-Origin", '*');
}

const app = express();

app.get("/api", (req, res) => {
    setHeaders(res);
    db.serialize(() => {
        db.all("SELECT * FROM notifications", (err, rows) => {
            if (err) {
                console.log(err);
                res.end(err);
            } else {
                rows.forEach((value) => {
                    res.write(value);
                });
                res.end();
            }
        });
    });
});

app.post("/api", (req, res) => {
    setHeaders(res);
    const params = getQueryParams(req);
    res.end(params);
});

app.delete("/api", (req, res) => {
    setHeaders(res);
    const params = getQueryParams(req);
    res.end(params);
});

app.listen(PORT, HOSTNAME, () => {
    console.log(`API server started listening on ${HOSTNAME}:${PORT}`);
}).on("close", () => {
    db.close();
});
