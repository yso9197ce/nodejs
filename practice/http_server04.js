const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8'
    })
    fs.writeFile('./heard2.txt', JSON.stringify(req.headers, null, 4), error => {
        if(error){
            res.end('<p>錯誤</p>');
        }else{
            fs.readFile('./heard2.txt', (error, data) => {
                if(error){
                    res.end('<p>錯誤</p>');
                }else{
                    res.end(data);
                }
            })
        }
    })
});

server.listen(3000);

