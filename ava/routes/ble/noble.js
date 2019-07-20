var noble = require("noble");
const cwd = process.cwd();
var BufferReader = require("buffer-reader");
var CircularJSON = require('circular-json');
var firebase = require(cwd + "/firebase/firebase");
var time = require(cwd + "/time/time");
var command = firebase.ref("/Command");
var Ava = command.child("AVA-000000");
var BleDevice = Ava.child("BleDevice");
var AddDevice = Ava.child("AddDevice");
var BleLog = BleDevice.child("Log");
var AddDevice_Log = AddDevice.child("Log");
var bleJSON = new Object();
var remoteState = 'close';
var bleAddress;
var MAC = "b8:27:eb:3e:e6:c7";
var now = time();

const remoteAutentication = "Remote-000000";
//인증을 하는 이유
// 
var RemoteCharacter;
var AuthCharacter;
var connetablePeri;

BleLog.limitToLast(1).on("child_added", (snapshot, prevChildKey) =>{
  var newPost = snapshot.val();
  console.log(newPost.method);
  if(newPost.method =="connect"){
  	if(connetablePeri==null){
      console.log("No Matching Device");
    }else{
      var Mac_Address = newPost.MAC_address;
      //MAC = Mac_Address;
      connectAndSetUp(connetablePeri,Mac_Address);
    }
  }
});

AddDevice.child(MAC).child("Log").limitToLast(1).on("child_added", (snapshot, prevChildKey) =>{
  var newPost = snapshot.val();
  console.log(newPost);
  if(newPost==null){
    console.log("Waiting Remote Command");
  }else{
    // var key = Object.keys(newPost.Log).lastIndexOf(0);
    // console.log(key);
    if(newPost.method == "state"){
      readState();
    }else if(newPost.method == "on"){
      sendData('on');
    }else if(newPost.method == "off"){
      sendData('off');
    }
  }
});

// BleDevice.on("value",(snapshot)=>{
//   var devices = snapshot.val();
//   //console.log(devices);
//   var MAC;
//   for(key in devices){
//     //console.log(devices[key]);
//     if(devices[key].localName == "Remote"){
//       MAC = key;
//     }
//   }
//   console.log(MAC);
//   if(MAC !=null){
//     AddDevice.child(MAC).on("child_added", (snapshot, prevChildKey) =>{
//       var newPost = snapshot.val();
//       console.log(newPost);
//       if(newPost==null){
//         console.log("Waiting Remote Command");
//       }else{
//         // var key = Object.keys(newPost.Log).lastIndexOf(0);
//         // console.log(key);
//         if(newPost.method == "state"){
//           readState();
//         }else if(newPost.method == "open"){
//           sendData('open');
//         }else if(newPost.method == "close"){
//           sendData('close');
//         }
//       }
//     });
//   }
// });

// AddDevice.on("child_added", (snapshot, prevChildKey) =>{
//   var newPost = snapshot.val();
//   if(newPost.Log == null){
//     console.log("Waiting Remote Command");
//   }else{
//     var length = Object.keys(newPost.Log).length;
//     var newestKey = Object.keys(newPost.Log)[length-1];
//     var newestPost = newPost.Log[newestKey];
//     console.log(newestPost.method);
//     // var key = Object.keys(newPost.Log).lastIndexOf(0);
//     // console.log(key);
//     if(newestPost.method == "state"){
//       readState();
//     }else if(newestPost.method == "open"){
//       sendData('open');
//     }else if(newestPost.method == "close"){
//       sendData('close');
//     }
//   }
// });



startBLE();
function startBLE(){
  noble.on("stateChange", function(state) {
    if (state === "poweredOn") {
      noble.startScanning();
    } else {
      noble.stopScanning(); 
    }
  });

  noble.on("discover", function(peripheral) {
    // if(peripheral.advertisement.serviceUuids.toString()!=""){
   	// 	connectAndSetUp(peripheral);
   	// }
    
    
    if (peripheral.advertisement.localName == "ava") {
      connetablePeri = peripheral;
      var address = peripheral.address;
      var BleDevice_List = BleDevice.child(address);
    
      var localName = peripheral.advertisement.localName + "";
      var connectable = peripheral.connectable + "";
      var serviceUuids = peripheral.serviceUuids + "";
      var deviceJSON = new Object();
      deviceJSON.localName = localName;
      deviceJSON.connectable = connectable;
      deviceJSON.serviceUUID =serviceUuids;
      console.log(deviceJSON);
      BleDevice_List.set(deviceJSON);
      //console.log(connetablePeri);
      //connectAndSetUp(peripheral);
    }
  });
}

function connectAndSetUp(peripheral,Mac_Address) {
  //noble.stopScanning();
  //console.log(peripheral);
  var serviceUUIDs = peripheral.advertisement.serviceUuids;
  bleJSON.localName = peripheral.advertisement.localName;
  bleJSON.serviceUUID = serviceUUIDs[0];
  bleJSON.connectable = peripheral.connectable+"";
  bleAddress = peripheral.address;
  var now_Address = peripheral.address+"";
  if(now_Address!=Mac_Address){
    console.log(now_Address + Mac_Address);
    console.log("not Matching");
  }else{
  //connetablePeri = peripheral;
    peripheral.connect(function(error) {
       if(error) console.log(error);
       console.log(serviceUUIDs);
    	peripheral.discoverServices(serviceUUIDs,(err,services)=>{
        if(err) console.log(err);
      	console.log(services);
      	var service = services[0];
      	service.discoverCharacteristics([],function(err,characteristics){
          if(err) console.log(err);
      		onServicesAndCharacteristicsDiscovered(err,services,characteristics,bleAddress);
      	});
    	});       
    });
  }
  //peripheral.disconnect();
  peripheral.on("connect",function(){
    //console.log("connect");
  });
  peripheral.on("disconnect",function(){
    //console.log("disconnect");
  });
}

function onServicesAndCharacteristicsDiscovered(error,services,characteristics,bleAddress) {
  if (error) {
    console.log("Error discovering services and characteristics " + error);
    return;
  }
  console.log(characteristics);
  for(var i =0; i<characteristics.length; i++){
    if(characteristics[i].uuid=="ff00"){
      AuthCharacter = characteristics[i];
      //console.log(characteristics[i]);
    }else if(characteristics[i].uuid=="ff11"){
      RemoteCharacter = characteristics[i];
    }
  }
  bleJSON.AuthCharacterUUID = AuthCharacter.uuid;
  bleJSON.RemoteCharacterUUID = RemoteCharacter.uuid;
  //bleJSON.authenticated = false;
  console.log(bleJSON);
  BleDevice.child(bleAddress).set(bleJSON);
  readAuth();
  // RemoteCharacter.read((err,data)=>{
  //   if(err) console.log(err);
  //   var reader = new BufferReader(data);
  //   state = reader.nextString(data.length);
  //   bleJSON.state = state;
    
  // });
}

function readAuth(){
  if(AuthCharacter==null){
    console.log("cannot read");
  } else {
    AuthCharacter.read((err,data)=>{
      if(err) console.log(err);
      var reader = new BufferReader(data);
      //console.log(AuthCharacter);
      //console.log(reader.nextString(data.length));
      var authentication = new Buffer(remoteAutentication);
      if(data.equals(authentication)){
        console.log("ok");
        var AddDevice_JSON = new Object();
        AddDevice_JSON.AuthCharacterUUID = AuthCharacter.uuid;
        AddDevice_JSON.RemoteCharacterUUID = RemoteCharacter.uuid;
        AddDevice_JSON.localName = "Ava-Light";
        AddDevice.child(bleAddress).set(AddDevice_JSON);
        var method_JSON = new Object();
        method_JSON.on = "on";
        method_JSON.off = "off";
        method_JSON.variable = "None"
        AddDevice.child(bleAddress).child('methods').set(method_JSON);
      }else{
        console.log(authentication);
        console.log(data);
        console.log("not ok")
      }
    });
  }
}

function readState() {
  if(RemoteCharacter == null){
    console.log("cannot read");
  }else{
    RemoteCharacter.read((err,data)=>{
      if(err) console.log(err);
      var reader = new BufferReader(data);
      state = reader.nextString(data.length);
      AddDevice.child(bleAddress).child('state').set(state);
      console.log(state);
    })
  }
}

function sendData(data) {
  if(RemoteCharacter == null){
    console.log("cannot send");
  }else{
    let buffer = new Buffer(data);
    RemoteCharacter.write(buffer, false, function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log("write : " + data);
        BleDevice.child(bleAddress).child("state").set(data);
      }
    });
  }
}


module.exports = noble;