const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const { execSync } = require('child_process');

const PORT = 8080;
const HOST = '192.168.2.139';

// TODO: serve www.html

function fileToString(path) {
    return fs.readFileSync(path).toString();
}

function getQueryParams(url) {
    return querystring.parse(new URL('http://' + HOST + url).search);
}

function getHandler() {
    return fileToString('./data.json');
}

function postHandler(id, room, description) {
    // POST not implemented yet
    // TODO: deal with whitespace in description
    execSync('python post_call.py ' + toString(id) + ' ' + toString(room));
    // respond with new call
    return "{}";
}

function deleteHandler(id) {
    // DELETE not implemented yet
    execSync('python delete_call.py ' + toString(id));
    // respond with deleted call
    return "{}";
}

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Content-Type', 'application/json');

    const params = getQueryParams(req.url);

    switch (req.method) {
        case 'GET':
            res.write(getHandler());
            break;
        case 'POST':
            // TODO: deal with undefined fields
            res.write(postHandler(params.id, params.room, params.description));
            break;
        case 'DELETE':
            // TODO: deal with undefined fields
            res.write(deleteHandler(params.id));
            break;
        default:
            break;
    }

    res.end();

});

server.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));