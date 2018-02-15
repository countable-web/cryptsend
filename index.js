const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const path = require('path');

const server = process.env.SERVER || 'http://localhost:1234';

const base64urltok = (l) => {
    return crypto.randomBytes(l).toString('base64')
        .replace(/\//g, '-')
        .replace(/=/g, '');
}

const upload = (req, res) => {
    var hash =
        base64urltok(2) +
        '/' +
        base64urltok(22);
    var target = './public/data/' + hash;
    mkdirp(target, err => {
        var form = new formidable.IncomingForm();
        form.uploadDir = target;
        form.on('fileBegin', function(name, file) {
            //rename the incoming file to the file's name
            file.path = form.uploadDir + "/" + encodeURIComponent(file.name);
        })
        form.parse(req, function(err, fields, files) {
            var content, contentType, success = true;
            if (files.f) {
                var newfile = server + files.f.path.replace(
                    /^.\/public/g, '');
                message = "saved to " + newfile;
            } else {
                message = "no file uploaded";
                success = false;
            }
            if (fields.ajax) {
                content = JSON.stringify({
                    success: success,
                    message: message
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
    var contentType = 'text/html';
    switch (extname) {
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

    fs.readFile(file_path, function(error, content) {
        if (error) {
            console.log(error);
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(200, {
                        'Content-Type': contentType
                    });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                res.end();
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(content, 'utf-8');
        }
    });

}).listen(1234);
