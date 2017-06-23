var net = require('net');
var fs  = require('fs');
var  dl  = require('delivery');
var shell = require('shelljs'); 
var sys = require('sys');
var main = require('./main.js');
var result = require('./resultDelivery.js')
var exec = require('child_process').exec; 
var timeArray = [];
module.exports.timeArray = timeArray;
exports.createContainer = function(ipAddress, hostPort) {
var cmd = 'docker run -d -p '+hostPort+':4730 -t --name='+ipAddress+' dbscan';
exec(cmd, function(error, stdout, stderr) {
    var startTime = Math.round(+new Date()/1000);
    timeArray.push({ip:ipAddress, time:startTime});
    console.log(timeArray);
    console.log(stdout);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    else{
        console.log('stdout: container created for the client');
        main.hasContainer.push(ipAddress);
        main.activeHosts.push(ipAddress);
    }
});
    
}
exports.restartContainer = function(ipAddress) {
    console.log('trying to restart the container');
    var paused = 'docker inspect -f "{{.State.Paused}}" '+ipAddress;
    exec(paused, function(error, stdout, stderr) {
     console.log(stdout);
     if( stdout == false ) {
        console.log("container is already running");
      }
     if( stdout == true ){
        console.log('isnide unpause');
    var unpause = 'docker unpause '+ipAddress;
    exec(unpause, function(error, stdout, stderr) {
    console.log('stdout: container resumed for the client');
    main.activeHosts.push(ipAddress);   
    if (error !== null) {
      console.log('exec error: ' + error);
      }
    }); 
}
   
    if (error !== null) {
      console.log('exec error: ' + error);
    }
       
});     

}

exports.pauseContainer = function(host) {
    var cmd = 'docker pause '+ host;
    console.log('pausing the container'+ host); 
    exec(cmd, function(error, stdout, stderr) {
    if(stdout){
    console.log('container paused');
      main.activeHosts.pop(host);
    }
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    }); 
    
}

exports.deleteContainer = function(host) {
 console.log('stoping the container');
    var unpause = 'docker unpause '+host;
    exec(unpause, function(error, stdout, stderr) {
    console.log(stdout);
        
        if(stdout){
          var stop = 'docker stop '+host;
    exec(stop, function(error, stdout, stderr) {
    console.log(stdout);
        console.log(stderr);
    if(stdout){
    console.log('container stopped');
    var remove = 'docker rm '+host;
    exec(remove, function(error, stdout, stderr) {
    console.log(stdout);
        console.log(stderr);
    if(stdout){
    console.log('container removed');  
    var idx;    
    for(var i = 0, len = timeArray.length; i < len; i++) {
    if (timeArray[i].ip === host) {
        idx = i;
        break;
    }
 }    
    console.log(idx);    
    var sTime = timeArray[idx].time;  
    var eTime = Math.round(+new Date()/1000);
    var timTaken = eTime - sTime;
    console.log('container was active for'+timTaken+'seconds'); 
    console.log('initiating result delivery');
    result.deliverResult(timTaken,host);    
    timeArray.pop({ip:host});
    
 
      }
    
    });
    main.activeHosts.pop(host);
    main.hasContainer.pop(host);    
    }
        if (error !== null) {
    }
    });
 }
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    }); 
  
}