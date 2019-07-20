const bleno = require('bleno');
const util = require('util');
const LED = 25; // wPi 핀번호: 25
var ledstate = 0; // led 켜진상태
var nodename = 'Ava'; // Profile명
var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;
var SwitchCharacteristic = function () {
    SwitchCharacteristic.super_.call(this, {
        uuid: 'Ava0000',
        properties: ['read', 'write', 'check'],
        descriptors: [
            new bleno.Descriptor({
                uuid: 'Ava00000',
                value: 'Ava Project'
            })
        ]
    });
};
util.inherits(SwitchCharacteristic, Characteristic);

// central 기기에서 read request 를 하면 peripheral 에서 이 함수가 실행됨
SwitchCharacteristic.prototype.onReadRequest = (offset, callback) => {
    var data = new Buffer(1);
    console.log('read request');
    data[0] = ledstate;
    callback(this.RESULT_SUCCESS, data); // central 기기로 data 전송
};
// central 기기에서 write request 를 하면 peripheral 에서 이 함수가 실행됨
SwitchCharacteristic.prototype.onWriteRequest =
    (data, offset, withoutResponse, callback) => {
        if (data[0]) { // central 에서 온 data[0]가 1 이라면
            console.log("블루투스> 데이터수신: " + data.toString('hex') + ' (LED ON)');
            gpio.digitalWrite(LED, 1); // led를 켬
            ledstate = 1;
        }
        else { // data[0] 이 0 이라면
            ledstate = 0;
            console.log("블루투스> 데이터수신: " + data.toString('hex') + ' (LED OFF)');
            gpio.digitalWrite(LED, 0); // led를 끔
        }
        callback(this.RESULT_SUCCESS); // central 기기로 응답(성공)을 전송
    };

var lightService = new PrimaryService({
    uuid: 'ff10',
    characteristics: [
        new SwitchCharacteristic()
    ]
});
bleno.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        bleno.startAdvertising(nodename, [lightService.uuid]);
        console.log("-------------------------------");
        console.log("블루투스 > ON (" + nodename + " 가동)");
    } else {
        bleno.stopAdvertising();
        console.log("블루투스 > Advertising 을 중단합니다");
    }
});

bleno.on('advertisingStart', function (error) {
    if (!error) {
        console.log("블루투스 > Advertising 을 시작합니다...");
        console.log("---------------------------------------");
        bleno.setServices([lightService]);
    }
    else
        console.log("블루투스 > Advertising 도중 오류발생");
});
function exit() {
    console.log("블루투스> 프로그램을 종료합니다");
    process.exit();
}
process.on('SIGINT', exit);
