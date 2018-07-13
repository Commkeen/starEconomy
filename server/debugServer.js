var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic('bin'));
app.use('/src', serveStatic('src'));
app.listen(5858);