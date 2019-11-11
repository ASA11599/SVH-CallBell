const http = require('http');
const querystring = require('querystring');
const sqlite = require('sqlite-sync');
const URL = require('url').URL;

const PORT = 8080;
const HOSTNAME = 'localhost';

sqlite.connect('db/callbell.db');

function getQueryParams(url) {
    return querystring.parse(new URL('http://' + HOSTNAME + url).search.slice(1));
}

function getData() {
    return sqlite.run('SELECT * FROM notifications');
}

function getHandler() {
    return JSON.stringify(getData());
}

function postHandler(room, description) {
    sqlite.run(`INSERT INTO notifications(room, description) VALUES(${room}, "${description}")`);
    return JSON.stringify(getData());
}

function deleteHandler(id) {
    sqlite.run(`DELETE FROM notifications WHERE id=${id}`);
    return JSON.stringify(getData());
}

const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url.slice(0, 4) === "/api") {

        res.setHeader('Content-Type', 'application/json');

        const params = getQueryParams(req.url);

        switch (req.method) {
            case 'GET':
                console.log('GET ' + req.url);
                res.statusCode = 200;
                res.write(getHandler());
                break;
            case 'POST':
                console.log('POST ' + req.url);
                res.statusCode = 201;
                res.write(postHandler(params.room, params.description));
                break;
            case 'DELETE':
                console.log('DELETE ' + req.url);
                res.statusCode = 200;
                res.write(deleteHandler(params.id));
                break;
            default:
                break;
        }

    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.write("404 not found");
    }

    res.end();

});

server.listen(PORT, HOSTNAME, () => console.log(`API server listening at ${HOSTNAME} on port ${PORT}`));