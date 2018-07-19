module.exports = {
    hostname: '127.0.0.1',
    port: '3001',
    root: process.cwd(),
    compress: /\.(html|js|css|md)/,
    cache: {
        maxAge: 600,
        cacheControl: true,
        expires: true,
        lastModified: true,
        eTag: true
    }
}