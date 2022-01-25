const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    })
    res.write('<div>123</div>');
    res.end(`<h2>hi ${req.url}</h2>`);
});

server.listen(3000);

