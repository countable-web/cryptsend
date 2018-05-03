const request = require('request')
const minimist = require('minimist')
const fs = require('fs');
const path = require('path');

const argv = minimist(process.argv.slice(2));
const url = argv._[1] || process.env.SERVER || 'http://localhost:1234';

var req = request.post(url, function(err, resp, body) {
    if (err) {
        console.log('Error!' + err + resp + body);
    } else {
        console.log('success' + body);
    }
});
var form = req.form();
// form.append('f', fs.createReadStream(__dirname + '/' + argv._[0]), {
form.append('f', fs.createReadStream(__dirname + path.sep + argv._[0]), {
    filename: argv._[0]
});
