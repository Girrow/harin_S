var express = require('express');
var router = express.Router();
//네이버 tts(Text->Speech)
var client_id = 'mndf5m4qeu';
var client_secret = 'RDchLs9M6iW3RtkjP3GMOnz87H8Pmz7IXhBjNCqF';
var fs = require('fs');

router.get('/', function (req, res) {
    var api_url = 'https://naveropenapi.apigw.ntruss.com/voice/v1/tts';
    var request = require('request');
    var options = {
        url: api_url,
        form: { speaker: 'mijin', speed: '0', text: '좋은 하루 되세요' },
        headers: { 'X-NCP-APIGW-API-KEY-ID': client_id, 'X-NCP-APIGW-API-KEY': client_secret },
    };
    var writeStream = fs.createWriteStream('./tts1.mp3');
    var _req = request.post(options).on('response', function (response) {
        console.log(response.statusCode); // 200
        console.log(response.headers['content-type']);
    });
    _req.pipe(writeStream); // file로 출력
    _req.pipe(res); // 브라우저로 출력
});

module.exports = router;