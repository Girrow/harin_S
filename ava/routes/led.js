var express = require("express");
//var ws281x = require("rpi-ws281x-native");
var router = express.Router();
const cwd = process.cwd();
const hexRgb = require("hex-rgb");
var weather_request = require("request");
var bodyParser = require("body-parser");
var bleno = require('bleno');
var util = require('util');
var firebase = require(cwd + "/firebase/firebase");
var command = firebase.ref("/Command");
var Ava = command.child("AVA-000000");
var led = Ava.child("LED");
var ledLog = led.child("Log");
var ledState = led.child("State");

var pixel = require("node-pixel");
var five = require("johnny-five");

var board = new five.Board({
  repl:false
});
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 8}, ], // this is preferred form for definition
        gamma: 2.8, // set to a gamma that works nicely for WS2812
    });

    strip.on("ready", function() {
        // do stuff with the strip here.
        strip.color("#000000");
        strip.show();
    });
    // setTimeout(function(){
    //  strip.off();
    // },3000)
});


// var rgbColor;
// var NUM_LEDS = parseInt(process.argv[2], 10) || 8,
//     pixelData = new Uint32Array(NUM_LEDS);

// ws281x.init(NUM_LEDS,{
//   dma: 10,
//   gpio:13
// });

//ws281x.init(NUM_LEDS,{gpio:13});

    // ---- trap the SIGINT and reset before exit

// process.on("SIGINT", function() {
//   ws281x.reset();
//   process.nextTick(function() {
//     process.exit(0);
//   });
// });


ledLog.limitToLast(1).on("child_added", (snapshot, prevChildKey) => {
  var newPost = snapshot.val();
  console.log(newPost);
  if(newPost.now == "on"){
    var stateJSON = new Object();
    stateJSON.color = newPost.color;
    stateJSON.now = "on";
    led.child("State").set(stateJSON);
    console.log(stateJSON);
    changeLED(newPost.color);
    //rgbColor = hexRgb(newPost.color);
    // var ledColor = rgb2Int(rgbColor.red, rgbColor.green, rgbColor.blue);
    // for (var i = 0; i < 8; i++) {
    //   changeLed(i, ledColor, 100);
    // }
  }else if(newPost.now == "off"){
    var stateJSON = new Object();
    stateJSON.color = newPost.color;
    stateJSON.now = "off";
    led.child("State").set(stateJSON);
    console.log(stateJSON);
    changeLED(newPost.color);
  }
  //console.log(newPost);
});

function changeLED(color){
  if(strip == null){
    console.log("strip is NULL");
  }else{
    strip.color(color);
    strip.show();
  }
}

// function changeLed(ledId, color, brightness) {
//   ws281x.setBrightness(brightness);
//   pixelData[ledId] = color;
//   ws281x.render(pixelData);
// }

// function switchAllLedOff() {
//   ws281x.setBrightness(0);
//   var noColor = rgb2Int(0, 0, 0);
//   for (var i = 0; i < NUM_LEDS; i++) {
//     pixelData[i] = noColor;
//   }
//   ws281x.render(pixelData);
// }

// function rgb2Int(r, g, b) {
//   return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
// }
// // //
//
module.exports = router;
