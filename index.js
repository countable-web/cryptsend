
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var crypto = require('crypto');
const mkdirp = require('mkdirp');

http.createServer(function (req, res) {
  if (req.method == 'POST') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var hash = crypto.randomBytes(36).toString('hex');

      var newpath = '/tmp/' + hash;
      mkdirp(newpath, err => {
        var newfile = newpath + '/' + files.filetoupload.name;
        fs.rename(oldpath, newfile, function (err) {
          if (err) throw err;
          res.write('File uploaded to:' + newfile);
          res.end();
        });
      })
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(3000);

