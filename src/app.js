const http = require('http');
const config = require('./config/defaultConfig');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route');

const server = http.createServer((req,res) => {
    const url = req.url;
    const filePath = path.join(config.root , url);
    route(req , res , filePath);
});

server.listen(config.port,config.hostname,()=> {
    const addr = `http://${config.hostname}:${config.port}`;
    console.log(addr);
})
