var apiai = require("../module/apiai");
var app = apiai("345a55cae0ee4acc8fbb13857234d449");
var melon_request = require("request");
var led_request = require("request");
const setObj = new Set([
  "Light_On",
  "Light_Off",
  "Light",
  "welcome",
  "Light_Color_Change",
  "d_test",
  "Light_Theme",
  "CGV",
  "Melon_save",
  "Melon_recommand",
  "Melon_artist",
  "Melon_today"
]);

function sleep(ms) {
  ts1 = new Date().getTime() + ms;
  do ts2 = new Date().getTime();
  while (ts2 < ts1);
}

module.exports = function(query) {
  var request = app.textRequest(query, {
    sessionId: "<unique session id>"
  });
  const responseFromAPI = new Promise(function(resolve, reject) {
    request.on("error", function(error) {
      reject(error);
    });
    request.on("response", function(response) {
      console.log(response);
      console.log("-------------------------------------");
      console.log("color : " + response.result.parameters.color);
      console.log("-------------------------------------");
      console.log("result : " + response.status.errorType);
      console.log("-------------------------------------");
      console.log("user_content : " + query);
      console.log("-------------------------------------");
      console.log("object : " + response.result.parameters.name);
      console.log("-------------------------------------");
      console.log("act : " + response.result.parameters.act);
      console.log("-------------------------------------");
      console.log("method : " + response.result.action);
      console.log("-------------------------------------");
      console.log("content : " + response.result.fulfillment.speech);
      console.log("-------------------------------------");
      var json = {
        result: response.status.errorType,
        user_content: query,
        object: response.result.parameters.name,
        act: response.result.parameters.act,
        method: response.result.action,
        content: response.result.fulfillment.speech
      };
      console.log("json.method =" + json.method);
      if (setObj.has(json.method)) {
        json.result = "success";
        switch (json.method) {
          case "CGV":
            //cgv();
            break;
          case "Melon_save":
            melon_request(
              {
                uri: "http://localhost:3000/melon/save",
                method: "post",
                json: {}
              },
              function(error, response, body) {
                console.log("send");
                if (!error && response.statusCode == 200) {
                  console.log(body);
                }
              }
            );
            break;
          case "Melon_artist":
            const artist = response.result.parameters.artist[0];
            melon_request(
              {
                uri: "http://localhost:3000/melon/artist",
                method: "post",
                json: {
                  artist: artist
                }
              },
              function(error, response, body) {
                console.log("send");
                if (!error && response.statusCode == 200) {
                  console.log(body);
                }
              }
            );
            break;
          case "Melon_recommand":
            melon_request(
              {
                uri: "http://localhost:3000/melon/recommand",
                method: "post",
                json: {}
              },
              function(error, response, body) {
                console.log("send");
                if (!error && response.statusCode == 200) {
                  console.log(body);
                }
              }
            );
            break;
          case "Melon_today":
            melon_request(
              {
                uri: "http://localhost:3000/melon/today",
                method: "post",
                json: {}
              },
              function(error, response, body) {
                console.log("send");
                if (!error && response.statusCode == 200) {
                  console.log(body);
                }
              }
            );
            break;
          case "Light_On":
            response_method = 1;
            led_request(
              {
                uri: "http://localhost:3000/net/led/change_color",
                method: "post",
                json: {
                  color: "#FFFFFF"
                }
              },
              function(error, response, body) {
                console.log("send");
                if (!error && response.statusCode == 200) {
                  console.log(body);
                }
              }
            );
            break;
          case "Light_Off":
            response_method = 2;
            led_request(
              {
                uri: "http://localhost:3000/net/led/change_color",
                method: "post",
                json: {
                  color: "#000000"
                }
              },
              function(error, response, body) {
                console.log("send");
                if (!error && response.statusCode == 200) {
                  console.log(body);
                }
              }
            );
            break;
        }
      } else {
        //예외처리 해줄 것
        json.result = "fail";
        console.log("json.method =" + json.method);
      }
      console.log("res= " + JSON.stringify(json));
      resolve(JSON.stringify(json));
    });
  });
  request.end();
  return responseFromAPI;
};
