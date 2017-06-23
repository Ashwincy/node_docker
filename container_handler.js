var net = require('net');
var fs  = require('fs');
var  dl  = require('delivery');
var shell = require('shelljs'); 
var sys = require('sys');
var ping = require('ping');
var main = require('./main.js');
var docker = require('./docker.js');
var exec = require('child_process').exec; 

var pauseedHost = [];
exports.checkConnectivity = function() {
    //console.log(main.activeHosts.length);
    if(main.activeHosts.length >= 1){
     main.activeHosts.forEach(function(host){
        console.log('probing the host' + host);
     ping.sys.probe(host, function(isAlive){
     if(isAlive === false){ main.pausedHosts.push(host); main.activeHosts.pop(host); docker.pauseContainer(host);}
    });
  });
    }
}
exports.removeContainer = function() {
    if(main.pausedHosts.length >= 1){
     main.pausedHosts.forEach(function(host){
        console.log('probing the host' + host);

     ping.sys.probe(host, function(isAlive){
       // var msg = isAlive ? 'host ' + hosts[i] + ' is alive' : 'host ' + host$
     if(isAlive === false){ main.pausedHosts.pop(host); main.activeHosts.pop(host); docker.deleteContainer(host);}
    });
  });
    }
}