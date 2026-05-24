const fs = require("fs");

const requests = {};
const window = 60000;
const max = 20;

const ratelimiting = (req, res, next) => {
    const ip = req.ip;
    if (!requests[ip]) {
        requests[ip] = { count: 1, startime: Date.now() };
    } else {
        const currntime = Date.now();
        const totaltime = currntime - requests[ip].startime;
        if (totaltime < window) {
            requests[ip].count++;
        } else {
            requests[ip].count = 1;
            requests[ip].startime = Date.now();
        }
    }
    if (requests[ip].count > max) {
        return res.status(429).json({
            error: "requests exceeded"
        });
    }
    next();
}

// Logging Middleware
const loggingmiddleware = (req, res, next) => {
    const ip = req.ip;
    const method = req.method;
    const urlpath = req.originalUrl;
    const currenttime = new Date().toISOString();

    const log = `[${currenttime}] ${ip} ${method} ${urlpath}\n`;
    console.log(log.trim());

    fs.appendFile("requests.log", log, (err) => {
        if (err) console.error("Error writing log:", err);
    });

    next();
};

module.exports = {
    ratelimiting,
    loggingmiddleware
};