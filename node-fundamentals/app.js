
const http = require("node:http");

// Create HTTP server
const server = http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("Hello! Welcome to my Node.js server.");

});

// Start server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
