var someRandomPort = 8099,
  jot = require('json-over-tcp');
var ft = require('./fileTransfer.js') 
var fs = require('fs');
var main = require('./main.js');
var ip = require("ip");
var ownIP = ip.address();
exports.fileListener = function(){
var server = jot.createServer(someRandomPort);
server.on('connection', newConnectionHandler);
 
function newConnectionHandler(socket){
  socket.on('data', function(data){
    console.log("Client's result: " + data.result);
   main.hasResult.push(data.clientIP);
   fs.writeFile('result_'+data.clientIP+'.txt', data.result);
    // Wait one second, then write an answer to the client's socket 
    setTimeout(function(){
      socket.write({answer: 42});
    }, 1000);
  });
}
    server.listen(someRandomPort);
}
exports.createConnection = function(destiIP,clientIP){
  // Start a connection to the server 
    var justIP = '127.0.0.1';
        var data = fs.readFileSync('result.txt');
       var result = {
        "clientIP":  clientIP, 
        "destinationIP": destiIP,
        "nextIP": justIP,   
        "result":data
       }
 console.log('sending the result file to the desti IP'+destiIP);    
  var socket = jot.connect(someRandomPort, justIP, function(){
    // Send the initial message once connected 
    socket.write(result);
  });
  
  socket.on('data', function(data){
    // Output the answer property of the server's message to the console 
    console.log("Server's answer: " + data.answer);
    
  });
}
 exports.forwardData = function(data) {
    var socket = jot.connect(someRandomPort, data.destinationIP, function(){
    socket.write(data);
  });
 }
