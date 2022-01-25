const http = require('http');
const fs = require('fs').promises;

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8'
    })
    fs.writeFile('./heard3.txt', JSON.stringify(req.headers, null, 4)).then(() => {
        res.end('ok');
    })
});

server.listen(3000);

