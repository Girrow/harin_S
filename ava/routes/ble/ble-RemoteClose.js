var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
const Gpio = require('pigpio').Gpio;
const motor = new Gpio(18, {mode: Gpio.OUTPUT});

function RemoteCharacteristic(){
	RemoteCharacteristic.super_.call(this, {
		uuid : 'ff11',
		properties: ['read', 'write'],
		descriptors:[
			new BlenoDescriptor({
				uuid : 'fff111',
				value : 'Remote Open.'
			})
		]
	});
};

util.inherits(RemoteCharacteristic, BlenoCharacteristic);

RemoteCharacteristic.prototype.onReadRequest = function(offset, callback){
	var data = new Buffer(1);
  	console.log("read request");
  	data[0] = 1;
  	callback(this.RESULT_SUCCESS, data); // central 기기로 data 전송
};

RemoteCharacteristic.prototype.onWriteRequest = (data, offset, withoutResponse, callback)=>{
	if (data[0]) {
    	// central 에서 온 data[0]가 1 이라면
    	motor.servoWrite(1000);
    	state = 1;
  	} else {
  		console.log("wrong write");
    	// data[0] 이 0 이라면
    	motor.servoWrite(2000);
    	state = 0;
  	}
  	callback(this.RESULT_SUCCESS); // central 기기로 응답(성공)을 전송
};

module.exports = RemoteCharacteristic;


