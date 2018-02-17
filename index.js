const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const path = require('path');
var slug = require('slug');

const server = process.env.SERVER || 'http://localhost:1234';

const base64urltok = (l) => {
    return crypto.randomBytes(l).toString('base64')
        .replace(/\//g, '-')
        .replace(/=/g, '');
}

const HEADER = `
<html>
<body>
<p>This is a secret folder. I'll say it again, don't lose this link!</p>
`;

const FOOTER = `
</body>
</html>`;

const upload = (req, res) => {
    var hash =
        base64urltok(2) +
        '/' +
        base64urltok(22);
    var target = './public/data/' + hash;

    mkdirp(target, err => {
        const form = new formidable.IncomingForm();
        var paths = [],
            ajax = false;
        form.uploadDir = target;

        form.on('fileBegin', function(name, file) {
            //rename the incoming file to the file's name
            file.path = form.uploadDir + "/" + encodeURIComponent(file.name);
            paths.push(file.path);
        });

        form.on('field', function(name, value) {
            if (name === 'ajax') {
                ajax = true;
            }
        });

        form.on('end', function() {
            var content, contentType, success = true;
            if (paths.length) {
                var newfiles = paths.map(function(f) {
                    return server + f.replace(/^.\/public/g, '');
                });
                message = "saved to " + newfiles.join(',');
            } else {
                message = "no file uploaded";
                success = false;
            }
            if (ajax) {
                content = JSON.stringify({
                    success: success,
                    message: message,
                    dir: form.uploadDir.replace(/^.\/public/g, '')
                });
                contentType = 'application/json';
            } else {
                content = message;
                contentType = 'text/plain';
            }
            res.writeHead(success ? 200 : 400, {
                'Content-Type': contentType
            });
            res.write(content)
            res.end();
        })
        form.parse(req);
    });
}

http.createServer(function(req, res) {

    if (req.method == 'POST') {
        return upload(req, res)
    }

    var file_path = './public' + req.url;
    if (file_path === './public/') {
        file_path = './public/index.html';
    }

    var extname = path.extname(file_path);
    var contentType = 'application/octet-stream';
    switch (extname) {
        case '.txt':
            contentType = 'text/plain';
            break;
        case '.htm':
        case '.html':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    var toks = file_path.split('/')

    // directoryindex.
    if (toks[2] === 'data' &&
        toks.length === 5 &&
        toks[4].length > 0) {
        return fs.readdir(file_path, (error, files) => {
            if (error) {

                if (error.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end("404");
                }
                res.writeHead(500);
                return res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
            var content = HEADER + '<ul>';
            files.forEach(file => {
                content += '<li><a href="' + req.url + '/' + file + '">' + file + '</a></li>';
            });
            content += '</ul>' + FOOTER;
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            return res.end(content, 'utf-8');
        })
    }

    fs.readFile(file_path, function(error, content) {
        if (error) {
            console.log(error);
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end("404");
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(content, 'utf-8');
        }
    });

}).listen(1234);
