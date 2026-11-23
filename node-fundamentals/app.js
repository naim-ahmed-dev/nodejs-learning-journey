const http = require("node:http");

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;

    res.setHeader("Content-Type", "text/plain");

    if (url === "/" && method === "GET") {

        res.statusCode = 200;
        res.end("Welcome to Home Page");

    } else if (url === "/about" && method === "GET") {

        res.statusCode = 200;
        res.end("This is About Page");

    } else if (url === "/contact" && method === "GET") {

        res.statusCode = 200;
        res.end("Contact us here");

    } else {

        res.statusCode = 404;
        res.end("404 - Page Not Found");

    }

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});