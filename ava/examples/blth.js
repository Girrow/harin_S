const noble = require('noble');
noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        console.log("aaa");
        noble.startScanning();
    } else {
        console.log("bbb");
        noble.stopScanning();
    }
});
noble.on('discover', function (peripheral) {
    console.log(peripheral);
    if (peripheral.advertisement.localName == '3team-led') {
        console.log("블루투스> 찾았음(discovery) ------------------------- ");
        console.log("블루투스> 이름: " + peripheral.advertisement.localName);
        console.log("블루투스> 주소: " + peripheral.address);
        console.log("블루투스> 신호세기(RSSI): " + peripheral.rssi);
        console.log("------------------------------------");
        connectAndSetUp(peripheral);
    }
});
function connectAndSetUp(peripheral) {
    peripheral.connect(function (error) {
        let serviceUUIDs = ['ff10'];
        let characteristicUUIDs = ['ff11'];
        peripheral.discoverSomeServicesAndCharacteristics
            (serviceUUIDs, characteristicUUIDs,
            onServicesAndCharacteristicsDiscovered);
    });
    // attach disconnect handler
    peripheral.on('disconnect', onDisconnect);
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    if (error) {
        console.log('Error discovering services and characteristics ' + error);
        return;
    }
    var switchCharacteristic = characteristics[0];
    function sendData(byte) {
        let buffer = new Buffer(1);
        buffer[0] = byte;
        switchCharacteristic.write(buffer, false, function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log('블루투스> 데이터전송(write): ' + byte);
                // console.log(services); // peripheral 로부터 받은 profile 내용을 보려면 // 제거
                // console.log(characteristics);
            }
        });
    }
}
