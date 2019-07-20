const record = require("node-record-lpcm16");
const speech = require("@google-cloud/speech");
const request = require("request");
// 여기부터
var client_id = "mndf5m4qeu";
var client_secret = "RDchLs9M6iW3RtkjP3GMOnz87H8Pmz7IXhBjNCqF";
var fs = require("fs");
var omx = require('@kuronekomichael/omxdirector');

const client = new speech.SpeechClient();
const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "ko-KR";
let result = "";

const request_stt = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode
  },
  interimResults: false // If you want interim results, set this to true
};

// Stream the audio to the Google Cloud Speech API
const recognizeStream = client
  .streamingRecognize(request_stt)
  .on("data", data => {
    (result = `${data.results[0].alternatives[0].transcript}`),
      console.log(result),
      checkInput(result);
  });

function checkInput(result){
	if(result == "아바"){
		console.log("안녕하세요");
		var api_url = "https://naveropenapi.apigw.ntruss.com/voice/v1/tts";
    	var serequest = require("request");
    	console.log("res_.content:");
    	var options = {
      		url: api_url,
      		form: {
        		speaker: "mijin",
        		speed: "0",
        		text: "안녕하세요"
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
      //omx.play()
    	_req.pipe(writeStream); // file로 출력 여기까지
    	
	}else{
		request(
        {
          uri: "http://localhost:3000/text",
          method: "post",
          json: {
            user_input: result
          }
        },
        function(error, response, body) {
          console.log("send voice");
          if (!error && response.statusCode == 200) {
            console.log(body);
          }
        }
      );
	}
}

record.start(console.log("start")).pipe(recognizeStream);
