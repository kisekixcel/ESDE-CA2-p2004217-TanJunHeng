
const express=require('express');
const serveStatic=require('serve-static');

var fs = require('fs'),
    http = require('http'),
    https = require('https');

    var options = {
        key: fs.readFileSync( './sslcert/localhost.key' ),
        cert: fs.readFileSync( './sslcert/localhost.crt' ),
        requestCert: false,
        rejectUnauthorized: false
    };

var hostname="localhost";
var port= process.env.PORT||3001;


var app=express();


app.use(function(req,res,next){
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);
    //Checking the incoming request type from the client
    if(req.method!="GET"){
        res.type('.html');
        var msg='<html><body>This server only serves web pages with GET request</body></html>';
        res.end(msg);
    }else{
        next();
    }
});


app.use(serveStatic(__dirname+"/public"));

var server = https.createServer( options, app );

app.get("/", (req, res) => {
    res.sendFile("/public/home.html", { root: __dirname });
});

server.listen(port, function () {
    console.log( `Express server hosted at https://${hostname}:`  + server.address().port );
} );

// app.listen(port,hostname,function(){

//     console.log(`Server hosted at http://${hostname}:${port}`);
// });
