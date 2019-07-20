var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var isOn;
var index;
var URL;

function RadioCharacteristic(){
	RadioCharacteristic.super_.call(this, {
		uuid : 'ffffffffffffffffffff600000000000',
		properties: ['read', 'write'],
		descriptors:[
			new BlenoDescriptor({
				uuid : 'ffffffffffffffffffff6f1000000000',
				value : 'Ava Radio Control.'
			})
		]
	});

	isOn = false;
	index = -1;
};

util.inherits(RadioCharacteristic, BlenoCharacteristic);

RadioCharacteristic.prototype.onReadRequest = function(offset, callback){
	console.log('Read Radio : Ava NOW - ON : '+isOn+' / index : '+index+' / URL : '+ URL);
	callback(this.RESULT_SUCCESS, new Buffer(isOn+'&'+index));
};

RadioCharacteristic.prototype.onWriteRequest = (data, offset, withoutResponse, callback)=>{
	console.log('Write Radio : Req color - '+data);
	var req = data+'';
	var sp_req = req.split('&');
	
	if(sp_req[0] === 'undefined'){
		callback(this.RESULT_FAIL);
	}else{
		//Stop SIGMAL -1
		if(sp_req[0] == -1){
			//Stop Radio
			URL = '';
			isOn = false;
		}else{
			//Start Radio
			URL = sp_req[1];
			isOn = true;
		}
		index = sp_req[0];
		callback(this.RESULT_SUCCESS);
	}

};


module.exports = RadioCharacteristic;


