var express = require("express");
var router = express.Router();
var getRes = require("../module/getRes");
var led_request = require("request");
var bodyParser = require("body-parser");

//var MPlayer = require("mplayer");
//var player = new MPlayer();

// 여기부터
var client_id = "mndf5m4qeu";
var client_secret = "RDchLs9M6iW3RtkjP3GMOnz87H8Pmz7IXhBjNCqF";
var fs = require("fs");
// 여기까지

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", function(req, res, next) {
  res.render("main");
});

router.post("/", function(req, res, next) {
  const user_input = req.body.user_input;
  getRes(user_input).then(function(res_) {
    ///아래부터 수일이꺼
    var res__ = JSON.parse(res_);
    var api_url = "https://naveropenapi.apigw.ntruss.com/voice/v1/tts";
    var serequest = require("request");
    console.log("res_.content:");
    var options = {
      url: api_url,
      form: {
        speaker: "mijin",
        speed: "0",
        text: res__.content
      },
      headers: {
        "X-NCP-APIGW-API-KEY-ID": client_id,
        "X-NCP-APIGW-API-KEY": client_secret
      }
    };
    var writeStream = fs.createWriteStream("./tts1.mp3");
    var _req = serequest.post(options).on("response", function(seresponse) {
      console.log(seresponse.statusCode); // 200
      console.log(seresponse.headers["content-type"]);
    });
    _req.pipe(writeStream); // file로 출력 여기까지

    //player.openFile("./tts1.mp3");
    res.send(res_);
  });
});

module.exports = router;
