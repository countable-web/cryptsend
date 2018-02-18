const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const path = require('path');
const slug = require('slug');

const server = process.env.SERVER || 'http://localhost:1234';

const base64urltok = (l) => {
    return crypto.randomBytes(l).toString('base64')
        .replace(/\//g, '-')
        .replace(/=/g, '');
}

const mkdir = (req, res) => {
    var hash =
        base64urltok(2) +
        '/' +
        base64urltok(22);
    var target = 'data/' + hash;

    mkdirp('./' + target, err => {
        res.writeHead(302, {
            'Location': '/dir/' + target
            //add other headers here...
        });
        res.end();
    });
}

const upload = (req, res) => {
    const form = new formidable.IncomingForm();
    var paths = [],
        ajax = false;

    form.uploadDir = req.file_path;

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

}

const ls = (req, res) => {
    // directoryindex.

    fs.readdir(req.file_path, (error, files) => {
        if (error) {

            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end("404");
            }
            res.writeHead(500);
            return res.end('error: ' + error.code + ' ..\n');
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        return res.end(JSON.stringify(files), 'utf-8');
    })

}


const cat = (req, res) => {
    var extname = path.extname(req.file_path);
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

    fs.readFile(req.file_path, function(error, content) {
        if (error) {
            console.error(error);
            if (error.code === 'ENOENT') {
                return http404(res);
            } else {
                res.writeHead(500);
                res.end('error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(content, 'utf-8');
        }
    });

}

const http404 = (res) => {
    res.writeHead(404);
    res.end("no such file.");
}

http.createServer((req, res) => {

    var _tmp = req.url.split("?");
    const query = _tmp[1];
    var toks = _tmp[0].split("/");

    req.file_path = toks.slice(2).join('/');
    var command = toks[1];

    if (req.method == 'POST') {
        return upload(req, res);
    }

    if (command === '') {
        command = 'public';
        req.file_path = './public/index.html';
    }

    if (command === 'ls') {

        if (toks[2] === 'data' &&
            toks.length === 5 &&
            toks[4].length > 0) {
            return ls(req, res);
        }
    } else if (command === 'dir') {
        req.file_path = './public/dir.html'
        return cat(req, res);
    } else if (command === 'cat') {
        if (toks[2] === 'data' || toks[2] === 'public') {
            return cat(req, res);
        }
    } else if (command === 'mkdir') {
        return mkdir(req, res);
    } else {
        return http404(res);
    }

}).listen(1234);
