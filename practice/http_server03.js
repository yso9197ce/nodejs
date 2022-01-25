const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8'
    })
    fs.readFile('./heard.txt', (error, data) => {
        if(error){
            res.end('<p>錯誤</p>');
        }else{
            res.end(data);
        }
    })
});

server.listen(3000);

