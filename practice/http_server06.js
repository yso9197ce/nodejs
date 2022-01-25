const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async(req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8'
    })
    
    await fs.writeFile('./heard4.txt', JSON.stringify(req.headers, null, 4));
    res.end('OK');
});

server.listen(3000);

