var express = require("express");
var noble = require("noble");
const cwd = process.cwd();
var CircularJSON = require('circular-json');
var router = express.Router();
var time = require(cwd + "/time/time");
var firebase = require(cwd + "/firebase/firebase");
var command = firebase.ref("/Command");
var Ava = command.child("AVA-000000");
var Auth = Ava.child("Auth");
var bleDevice = Ava.child("BleDevice");

Auth.on("value",function(snapshot){
  console.log(snapshot.val());
  if(snapshot.val()==true){
    console.log("bleno");
    var bleno = require(cwd+"/routes/ble/ble.js");
  }else if(snapshot.val()==false){
    console.log("noble");
    var noble = require(cwd +"/routes/ble/noble.js");
  }else {
  	console.log("Waiting...");
  }
}, function(err){
  console.log(err.code);
});



// var action = "";
// var discoveredPeri;
// var foundCharacter;
// var connetablePeri;
// startBLE();
// noble.on("stateChange", function(state) {
//   if (state === "poweredOn") {
//     noble.startScanning();
//   } else {
//     noble.stopScanning(); 
//   }
// });

// noble.on("discover",function(peripheral){
//   	//console.log(peripheral);
//   	discoveredPeri = peripheral;
// });

// router.get("/", function(req, res) {
//   res.render("remote", { title: "Express" });
// });

// router.get("/ble/scan", function(req, res) {
//   if(connetablePeri!=null){
//   	res.status(200).send(CircularJSON.stringify(connetablePeri));
//   }else{
//   	res.status(200).send(JSON.stringify("not found connetable device"));
//   }
// });

// router.post("/ble/motor_open", function(req, res) {
//   //action = "open";
//   //startBLE(action);
//   sendData(0x01)
//   res.status(200).send(JSON.stringify("ledState"));
// });

// router.post("/ble/motor_close", function(req, res) {
//   //action = "close";
//   //startBLE(action);
//   sendData(0x00);
//   res.status(200).send(JSON.stringify("ledState"));
// });

// function startBLE(){
//   noble.on("stateChange", function(state) {
//     if (state === "poweredOn") {
//       noble.startScanning();
//     } else {
//       noble.stopScanning(); 
//     }
//   });

//   noble.on("discover", function(peripheral) {
//    	//connectAndSetUp(peripheral);
//     //console.log(peripheral);
//     //console.log(peripheral);
//     if(peripheral.advertisement.serviceUuids.toString()!=""){
//    		connectAndSetUp(peripheral);
//    	}
//     // if (peripheral.advertisement.localName == "Remote") {
      
//     // }
//   });
// }

// function connectAndSetUp(peripheral) {
//   //noble.stopScanning();
//   var serviceUUIDs = peripheral.advertisement.serviceUuids;
//   //connetablePeri = peripheral;
  
//    peripheral.connect(function(error) {
//      if(error) console.log(error);
//   	peripheral.discoverServices(serviceUUIDs,(err,services)=>{
//       if(err) console.log(err);
//     	var service = services[0];
//     	//console.log(service);
//     	service.discoverCharacteristics([],function(err,characteristics){
//         if(err) console.log(err);
//     		var characteristic = characteristics[0];
//     		onServicesAndCharacteristicsDiscovered(err,services,characteristics);
//     		//console.log(characteristics);
//     	});
//   	});  
//     //let characteristicUUIDs = ["ff11"];
//     //peripheral.discoverAllServicesAndCharacteristics();
//     //peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs,characteristicUUIDs,onServicesAndCharacteristicsDiscovered);
    
//   });
//   //peripheral.disconnect();
//   peripheral.on("connect",function(){
//     //console.log("connect");
//   });
//   peripheral.on("disconnect",function(){
//     //console.log("disconnect");
//   });
// }

// function onServicesAndCharacteristicsDiscovered(error,services,characteristics) {
//   if (error) {
//     console.log("Error discovering services and characteristics " + error);
//     return;
//   }
//   // if(action == "open"){
//   // 	var switchCharacteristic = characteristics[0];
//   // } else if(action == "close"){
//   // 	var switchCharacteristic = characteristics[1];
//   // }

//   foundCharacter = characteristics[0];
//   //console.log(foundCharacter);
//   //console.log(switchCharacteristic);
//   // function sendData(byte) {
//   //   let buffer = new Buffer(1);
//   //   buffer[0] = byte;
//   //   switchCharacteristic.write(buffer, false, function(error) {
//   //     if (error) {
//   //       console.log(error);
//   //     } else {
//   //       console.log("write : " + byte);
//   //     }
//   //   });
//   // }
//   //sendData(0x01);
//   //noble.stopScanning(); 
//   // function remote_motor_on() {
//   //    sendData(0x01);
//   //    setTimeout(remote_motor_off, 2000);
//   // }
//   // function remote_motor_off() {
//   //    sendData(0x00);
//   //    setTimeout(remote_motor_on, 2000);
//   // }
//   // setImmediate(remote_motor_on);
// }

// function sendData(byte) {
//   let buffer = new Buffer(1);
//   buffer[0] = byte;
//   foundCharacter.discoverDescriptors(function(err,descriptors){
//   	console.log(descriptors);
//   })
//   foundCharacter.write(buffer, false, function(error) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("write : " + byte);
//     }
//   });
// }


module.exports = router;