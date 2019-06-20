var http = require('http');
// var fs=require("fs");
var ex=require("express");
var static=require("serve-static");
var path=require("path");
var app=ex();
app.use(static(__dirname+"/static"));
var server = http.createServer(app);

server.listen(80, () => {
  console.log(`Server running at`);
});
