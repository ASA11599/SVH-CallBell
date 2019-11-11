const http = require('http');
const fs = require('fs');

const PORT = 80;
const HOSTNAME = "localhost";

const fileToServe = "./www.html";
const pageNotFound = "./404.html";

function fileToString(path) {
    return fs.readFileSync(path).toString();
}

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Content-Type', 'text/html');

    if (req.url === "/") {
        res.statusCode = 200;
        res.write(fileToString(fileToServe));
    } else {
        res.statusCode = 404;
        res.write(fileToString(pageNotFound));
    }

    res.end();

});

server.listen(PORT, HOSTNAME, () => console.log(`server listening at ${HOSTNAME} on port ${PORT}`));