var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var crypto = require('crypto');
const mkdirp = require('mkdirp');
const path = require('path');

const upload = (req, res) => {
    var hash = crypto.randomBytes(2).toString('hex') + '/' + crypto.randomBytes(34).toString('hex');
    var newpath = './public/data/' + hash;
    mkdirp(newpath, err => {
        var form = new formidable.IncomingForm();
        form.uploadDir = './public/data/' + hash;
        form.parse(req, function(err, fields, files) {
            var content, contentType;
            var newfile = newpath + '/' + files.filetoupload.name;
            if (fields.ajax) {
                content = '{"success": true, "saved_to": ' + newfile + '}';
                contentType = 'application/json';
            } else {
                content = "saved to " + newfile;
                contentType = 'text/plain';
            }
            res.writeHead(200, {
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
        console.log(error);
        if (error) {
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
