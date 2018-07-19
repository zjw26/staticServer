const {cache} = require('../config/defaultConfig');

function refreshRes(stats, res){
    const {maxAge, cacheControl, expires, lastModified, eTag} = cache;

    if(expires){
        res.setHeader('Expires', (new Date(Date.now() + maxAge)).toUTCString());
    }

    if(cacheControl){
        res.setHeader('Cache-Control', `public, max-age = ${maxAge}`);
    }

    if(lastModified){
        res.setHeader('Last-Modified', stats.mtime.toUTCString());
    }

    // if(eTag){
    //     res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
    // }
}

module.exports = function isFresh(stats, req, res){
    refreshRes(stats, res);
    const lastModified = req.headers['if-modified-since'];
    // const etag = req.headers['if-none-match'];
    if(!lastModified){
        return false;
    }

    if(lastModified && lastModified != res.getHeader('Last-Modified')){
        return false;
    }

    // if(!etag && etag != res.getHeader['etag']){
    //     return false;
    // }

    return true;
}