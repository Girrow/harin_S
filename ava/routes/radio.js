var express = require("express");
var router = express.Router();
const cwd = process.cwd();
var bodyParser = require("body-parser");
var firebase = require(cwd + "/firebase/firebase");
var time = require(cwd + "/time/time");
var Radio = firebase.ref('/Radio');
var command = firebase.ref("/Command");
var Ava = command.child("AVA-000000");
var omx = require('@kuronekomichael/omxdirector');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var radio = Ava.child('Radio');
var radio_Log = Ava.child('Radio').child("Log");
var radio_state = Ava.child('Radio').child("State");

radio_Log.limitToLast(1).on('child_added',function(snapshot){
  var newPost = snapshot.val();
  //console.log(newPost);
  if(newPost.method==null){
    console.log("Waiting Radio...");
  }else if(newPost.method == 'on'){
    console.log("radio on");
    var channel_key = newPost.ch_key;
    omx.play(channel_key);
  }else if(newPost.method == 'off'){
    console.log("radio off")
    omx.stop();
  }
});


// var isOn = false;



// var index = 0;

// //player.openFile("mms://live.wjmbc.co.kr/fm2");



// router.post("/radio_start", function(req, res) {

//   console.log("radio channel : " + req.body.radio_address);

//   isOn = true;

//   index = req.body.radio_index;

//   player.openFile(req.body.radio_address);

//   var start_radio = {

//     result: "success",

//     isOn: isOn,

//     index : index

//   };

//   res.status(200).send(JSON.stringify(start_radio));

// });



// router.post("/radio_stop", function(req, res) {

//   console.log("radio channel : " + req.body.radio_address);

//   isOn = false;

//   player.stop();

//   var stop_radio = {

//     result: "success",

//     isOn: isOn

//   };

//   res.status(200).send(JSON.stringify(stop_radio));

// });



// router.get("/radio_state", function(req, res) {

//   var radio_state = {

//     isOn: isOn,

//     index : index

//   };

//   res.status(200).send(JSON.stringify(radio_state));

// });



module.exports = router;