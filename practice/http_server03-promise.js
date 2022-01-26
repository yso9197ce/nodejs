const http = require('http');
const fs = require('fs');

function readFileAsync(filePath){
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, data) => {
            if(error){
                return reject(error);
            }else{
                resolve(data);
            }
        })
    })
}

const server = http.createServer(async(req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8'
    })

    const data = await readFileAsync('./heard.txt');
    res.end(data);
                               
});

server.listen(3000);

