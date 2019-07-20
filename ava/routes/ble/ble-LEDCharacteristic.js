var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var isOn;
var nowColor;

function LEDCharacteristic(){
	LEDCharacteristic.super_.call(this, {
		uuid : 'ffffffffffffffffffff500000000000',
		properties: ['read', 'write'],
		descriptors:[
			new BlenoDescriptor({
				uuid : 'ffffffffffffffffffff5f1000000000',
				value : 'Ava LED Control.'
			})
		]
	});

	isOn = false;
	nowColor = '#000000';
};

util.inherits(LEDCharacteristic, BlenoCharacteristic);

LEDCharacteristic.prototype.onReadRequest = function(offset, callback){
	console.log('Read LED : Ava NOW - ON : '+isOn+' / Color : '+nowColor);
	callback(this.RESULT_SUCCESS, new Buffer(isOn+'&'+nowColor));
};

LEDCharacteristic.prototype.onWriteRequest = (data, offset, withoutResponse, callback)=>{
	console.log('Write LED : Req color - '+data);
	var color = data+'';
	
	if(color === 'undefined'){
		callback(this.RESULT_FAIL);
	}else{
		if(color === '#000000'){
			isOn = false;
		}else{
			isOn = true;
		}
		nowColor = color;
		callback(this.RESULT_SUCCESS);
	}

};


module.exports = LEDCharacteristic;


