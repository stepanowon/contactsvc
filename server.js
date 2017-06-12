var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var cors = require('cors');
var path = require('path');
var fs = require('fs');

//app.use(cors());
app.enable("jsonp callback");   //jsonp 지원

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var server = app.listen(3000, function() {
    console.log("연락처 서비스가 3000번 포트에서 시작되었습니다!");
});

var router = require('./routes')(app);
