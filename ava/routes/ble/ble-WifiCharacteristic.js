var util = require('util');
var bleno = require('bleno');
const cwd = process.cwd();
var firebase = require(cwd + "/firebase/firebase");
var wifi_conf = require('rpi-wifi-connection');
var pi_wifi = require('pi-wifi');
var command = firebase.ref("/Command");
var Ava = command.child("AVA-000000");
var Auth = Ava.child("Auth");
var wifi = new wifi_conf();

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var wifiList;
var _status;

function getWifiList(){
	wifi.scan().then((ssids)=>{
		wifiList = ssids+"";
	}).catch((err)=>{
		wifiList = "fail";
	});
}

function getStatus(){
	wifi.getStatus().then((st)=>{
		_status = st;
		console.log(_status);
	}).catch((err)=>{
		_status = 'fail';
	});
};


function WifiCharacteristic(){
	WifiCharacteristic.super_.call(this, {
		uuid : 'ffffffffffffffffffff200000000000',
		properties: ['read', 'write'],
		descriptors:[
			new BlenoDescriptor({
				uuid : 'ffffffffffffffffffff2f1000000000',
				value : 'Wifi Control Module.'
			})
		]
	});
	getStatus();
	getWifiList();
};

util.inherits(WifiCharacteristic, BlenoCharacteristic);

WifiCharacteristic.prototype.onReadRequest = function(offset, callback){
	console.log('Read Wifi : Wifi offset = '+offset+'.\n');
	
	wifi.getStatus().then((st)=>{
		_status = st;
		callback(this.RESULT_SUCCESS, new Buffer(_status.ssid+'&'+_status.ip_address+'&'));
	}).catch((err)=>{
		callback(this.RESULT_SUCCESS, new Buffer('wifi not surported'));
	});
};

WifiCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback){
	console.log('Write Wifi : Wifi Data : ' + data);
	var req = data+'';
	var reqString = req.split('&');
	var req_ssid = reqString[0];
	var req_psk = reqString[1];
	console.log(req_ssid + ' / ' + req_psk);
	if(req){
		if(req_psk){
			console.log('type : wpa');
			wifi.connect({ssid : req_ssid, psk : req_psk}).then(()=>{
				//Auth.set(true);
				callback(this.RESULT_SUCCESS);
			}).catch((err)=>{
				callback(this.RESULT_FAIL);
			});	
		}else{
			console.log('type : ess');
			pi_wifi.connectOpen(req_ssid, (err, st)=>{
				if(err){
					console.log("ESS ERROR : " + err.message);
					callback(this.RESULT_FAIL);
				}else{
					console.log('TEST');
					callback(this.RESULT_SUCCESS);
				}
			});
		}
	}else{
		callback(this.RESULT_FAIL);
	}
};

module.exports = WifiCharacteristic;


