var net = require('net');
var fs  = require('fs');
var  dl  = require('delivery');
var geodist = require('geodist');
var exec = require('child_process').exec; 
var sys = require('sys');
var docker = require('./docker.js');
var cHandler = require('./container_handler.js');
var main = require('./main.js');
var geoData = require('./geoDistance.js');
var ft = require('./fileTransfer.js');
var locations = [{ip:'192.168.4.2', coords:{lat:'31',lon:'41'}},{ip:'192.168.4.3', coords:{lat:'41',lon:'51'}},{ip:'192.168.4.4', coords:{lat:'51',lon:'61'}}]

exports.deliverResult = function(timTaken,clientIP){
    switch (true) {
    case (timTaken < 100 ):
        getNearestNode({lat:'32', lon:'42'},clientIP)    
        //console.log('sending to node 2');    
        break;
    case (timTaken >= 100 && timTaken < 300):
        getNearestNode({lat:'42', lon:'52'},clientIP)    
        //console.log('sending to node 3');
        break;
    case (timTaken >= 300 && timTaken < 500):
        getNearestNode({lat:'52', lon:'62'},clientIP)    
        break;
    default:
        getNearestNode({lat:'52', lon:'62'},clientIP)    
       // console.log('sending to node 5');
        break;
}
}
function getNearestNode(coordinates, clientIP){
    var minDist = 10000;  
    var minIndex = 0;
    for(var i = 0, len = locations.length; i < len; i++) {
        var dist = geodist(coordinates,locations[i].coords);
        if ( dist < minDist){ minDist = dist; minIndex = i; }
    }
    var destinationIP = locations[minIndex].ip;
    console.log('choosen destination IP is'+destinationIP);
    ft.createConnection(destinationIP, clientIP);
}