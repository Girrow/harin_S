var http = require('http');
var fs=require("fs");
// var hostname = '127.0.0.1';
// var port = 3000;
var server = http.createServer(function(req, res){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  let url="";
  if(req.url == "/"){
    url="/index.html";
  }else{
    url=req.url;
  }
  res.end(fs.readFileSync(__dirname + url));
});

server.listen(80, () => {
  console.log(`Server running at`);
});
