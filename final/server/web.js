const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const PORT = 80;
const HOSTNAME = "localhost";

/**
 * These will be replaced with their hash
 */
const pPassword = "patient123";
const vPassword = "volunteer123";

const homePage = "./home.html";
const patientLogin = "./patientAuth.html";
const patientPage = "./patient.html";
const volunteerLogin = "./volunteerAuth.html";
const volunteerPage = "./volunteer.html";
const pageNotFound = "./404.html";

function fileToString(path) {
    return fs.readFileSync(path).toString();
}

function getQueryParams(url) {
    return querystring.parse(new URL('http://' + HOSTNAME + url).search.slice(1));
}

function authenticatePatient(passwordHash) {
    return passwordHash === pPassword;
}

function authenticateVolunteer(passwordHash) {
    return passwordHash === vPassword;
}

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Content-Type', 'text/html');

    switch (req.url.split('?')[0]) {
        case "/":
            res.statusCode = 200;
            res.write(fileToString(homePage));
            break;
        case "/patient":
            res.statusCode = 200;
            res.write(fileToString(patientLogin));
            break;
        case "/volunteer":
            res.statusCode = 200;
            res.write(fileToString(volunteerLogin));
            break;
        case "/vauth":
            if (authenticateVolunteer(getQueryParams(req.url).p)) {
                res.statusCode = 200;
                res.write(fileToString(volunteerPage));
            } else {
                res.statusCode = 200;
                res.write(fileToString(volunteerLogin));
            }
            break;
        case "/pauth":
            if (authenticatePatient(getQueryParams(req.url).p)) {
                res.statusCode = 200;
                res.write(fileToString(patientPage));
            } else {
                res.statusCode = 200;
                res.write(fileToString(patientLogin));
            }
            break;
        default:
            res.statusCode = 404;
            res.write(fileToString(pageNotFound));
            break;
    }

    res.end();

});

server.listen(PORT, HOSTNAME, () => console.log(`server listening at ${HOSTNAME} on port ${PORT}`));