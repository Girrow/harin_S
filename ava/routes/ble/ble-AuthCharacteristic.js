var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

const AvaPrimaryKey='AVA-000000';

function AuthCharacteristic(){
	AuthCharacteristic.super_.call(this, {
		uuid : 'ffffffffffffffffffff100000000000',
		properties: ['read', 'write'],
		descriptors:[
			new BlenoDescriptor({
				uuid : 'ffffffffffffffffffff1f1000000000',
				value : 'Check Ava Primary Key.'
			})
		]
	});
};

util.inherits(AuthCharacteristic, BlenoCharacteristic);

AuthCharacteristic.prototype.onReadRequest = function(offset, callback){
	console.log('Read Auth : Ava Primary Key.\n');
	callback(this.RESULT_SUCCESS, new Buffer(AvaPrimaryKey));
};

module.exports = AuthCharacteristic;


