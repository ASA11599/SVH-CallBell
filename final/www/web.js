const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const PORT = 3000;
const HOSTNAME = "192.168.64.2";

/**
 * MD5 hash of the patient and volunteer passwords
 */
const pPassword = "5f4dcc3b5aa765d61d8327deb882cf99";
const vPassword = "5f4dcc3b5aa765d61d8327deb882cf99";

const homePage = "./public/home.html";
const patientLogin = "./public/patientAuth.html";
const patientPage = "./public/patient.html";
const volunteerLogin = "./public/volunteerAuth.html";
const volunteerPage = "./public/volunteer.html";
const pageNotFound = "./public/404.html";
const hashScript = "./public/md5.js"

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
        case "/md5.js":
            res.setHeader('Content-Type', 'text/javascript');
            res.write(fileToString(hashScript));
            break;
        default:
            res.statusCode = 404;
            res.write(fileToString(pageNotFound));
            break;
    }

    res.end();

});

server.listen(PORT, HOSTNAME, () => console.log(`server listening at ${HOSTNAME} on port ${PORT}`));