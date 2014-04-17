var http = require('http');
var path = require('path');
var fs = require('fs');
var util = require('util');
var sys = require('sys');

var port = '1337';
var now = (new Date()).getTime();
var projectFolder = '';

// Main server app, handles requests and servers files
http.createServer(function (req, res) {

    var filePath = req.url;

    try {
        var result = fs.lstatSync('.' + filePath + '/');

        if(result.isDirectory()) {
            if(filePath.lastIndexOf('/') != filePath.length-1 && filePath.indexOf('.') < 0) {
                filePath += '/';
            }
            projectFolder = filePath;
            filePath += 'index.html';
        }
    }
    catch(ex) {
        //console.log(ex.message);
    }

    if (filePath == './' || filePath == '/') {
        filePath = '.' + 'index.html';
    }
    else {
        if( !filePath.match(projectFolder) )
            filePath = projectFolder + filePath;

        filePath = '.' + filePath;
    }

    var contentType = 'text/html';

    switch (path.extname(filePath)) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
    }

    fs.exists(filePath, function (exists) {

        if (exists) {
            fs.readFile(filePath, function (error, data) {
                if (error) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.write(data, 'utf-8');
                    res.end();
                }
            });
        }
        else {
            res.writeHead(404);
            res.end();
        }

    });

}).listen(port);

console.log('Server started at: ' + now + ', listening at: ' + port);