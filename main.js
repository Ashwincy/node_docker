// Controller program 
var net = require('net');
var fs  = require('fs');
var  dl  = require('delivery');
var exec = require('child_process').exec; 
var sys = require('sys');
var docker = require('./docker.js');
var cHandler = require('./container_handler.js');
var ft = require('./fileTransfer.js')

var HOST = '0.0.0.0';
var PORT = 6969; //port of the controller
var hasResult = [];
var hasContainer = [];
var connectedClients = [];
var activeHosts = [];
var stoppedHosts = [];
var pausedHosts = [];
var hostPort = 4000;
module.exports.stoppedHosts = stoppedHosts;
module.exports.hasResult = hasResult;

module.exports.hasContainer = hasContainer;
module.exports.pausedHosts = pausedHosts;
module.exports.activeHosts = activeHosts;
net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);    
     var sendResult = checkIfResult(sock.remoteAddress);
     if (sendResult === true){
         console.log('sending the result file');
        var data = fs.readFileSync('result_'+sock.remoteAddress+'.txt');
         sock.write(data);
     }
     else{
         sock.write('no result');
     }
    var hasContainer = checkContainer(sock.remoteAddress);
    if ( hasContainer === true ) {
        try{
        docker.restartContainer(sock.remoteAddress);
        }catch(err){
            console.log(err);
        console.log('could not restart the container');
        }
    }
    else {
        hostPort = hostPort+1;
        try{         
        docker.createContainer(sock.remoteAddress, hostPort);
            //console.log('container created');
        }catch(err){
            console.log(err);
            console.log('error in docker creation');
            }
        finally{
            console.log('container created');
        sock.write('port to connect your services is'+hostPort);
            
        }
    }
    sock.on('data', function(data) {
        
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        sock.write('You said "' + data + '"');
        
    });
    setInterval(function(){cHandler.checkConnectivity()},10000);
    setInterval(function(){cHandler.removeContainer()},30000);
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    //printTime();
}).listen(PORT, HOST);

function checkIfResult(ipAddress) {
     var idx = hasResult.indexOf(ipAddress);
        if (idx != -1) {
            return true;
        }
        else{
            //hasResult.push(ipAddress);
            return false;
        }
}

function checkContainer(ipAddress) {
     var idx = hasContainer.indexOf(ipAddress);
        if (idx != -1) {
            return true;
        }
        else{
            return false;
        }
}
ft.fileListener();
console.log('Server listening on ' + HOST +':'+ PORT);
