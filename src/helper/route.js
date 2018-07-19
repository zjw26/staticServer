const fs = require('fs');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const handlebars = require('handlebars');
const path = require('path');
const config = require('../config/defaultConfig'); 
const compress = require('./compress');
const isRefresh = require('.//cache');
const tplPath = path.join(__dirname,'../template/dir.tpl');
const mime = require('./mime');
const source = fs.readFileSync(tplPath,'utf-8');
const template = handlebars.compile(source);
// console.log(template())
module.exports = async function(req , res , filePath){
    try {
        const stats = await stat(filePath);
        if(stats.isFile()){
            const contentType = mime(filePath);
            res.setHeader("Content-Type" , contentType);
            if(isRefresh(stats, req, res)){
                res.statusCode = 304;
                res.end();
                return;
            }
            res.statusCode = 200;
            let rs = fs.createReadStream(filePath);
            if(filePath.match(config.compress)){
                rs = compress(rs,req,res);
            }
            rs.pipe(res);
        }else if(stats.isDirectory()){
            const files = await readdir(filePath);
            const dir = path.relative(config.root,filePath);
            const data = {
                title : path.basename(filePath),
                files : files.map((file)=>{
                    return {
                        file : file,
                        icon : mime(file)
                    }
                }),
                dir : dir ? `/${dir}` : ''
            }
            res.statusCode = 200;
            res.setHeader("Content-Type" , "text/html");
            console.log(template(data));
            res.end(template(data));
        }
    }catch(ex){
        console.log(ex);
        res.statusCode = 404;
        res.setHeader("Content-Type" , "text/plain");
        res.end(`${filePath} is not a directory or a file!`);
    }
}