const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8'
    })
    fs.writeFile('./heard.txt', JSON.stringify(req.headers, null, 4), error => {
        if(error){
            res.end('<p>錯誤</p>');
        }else{
            res.end('<p>沒錯</p>');
        }
    })
});

server.listen(3000);

