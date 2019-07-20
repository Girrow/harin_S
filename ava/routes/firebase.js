var express = require('express');
var router = express.Router();

var firebase_admin = require('firebase-admin');
var serviceAccount = require('../public/keystore/avaserver-7446f-firebase-adminsdk-6a479-7199d8510f.json');

firebase_admin.initializeApp({
  credential : firebase_admin.credential.cert(serviceAccount),
  databaseURL : "https://avaserver-7446f.firebaseio.com",
  databaseAuthVariableOverride: null
});

var firebase_admin_database = firebase_admin.database();
var firebase_admin_ref = firebase_admin_database.ref("/public_resource");
var TestNodeRef = firebase_admin_ref.child("TestNode");
TestNodeRef.on("child_added", (snapshot, prevChildKey)=>{
  var newPost = snapshot.val();
  console.log("## Child Add");
  console.log("작성자 : " + newPost.author);
  console.log("제목 : " + newPost.title);
  console.log("Key : " + newPost.key);
  console.log("NickName : " + newPost.NickName);
  console.log("상위 Post ID : " + prevChildKey);
});
TestNodeRef.on("child_changed", (snapshot)=>{
  var changedPost = snapshot.val();
  console.log("## Child Change");
  console.log("Key : " + changedPost.key);
  console.log("NickName : " + changedPost.NickName);
  console.log("상위 Post ID : " + changedPost.title);
});
TestNodeRef.on("child_removed", (snapshot)=>{
  var deletedPost = snapshot.val();
  console.log("## Child Remove");
  console.log("Key : " + deletedPost.key);
  console.log("NickName : " + deletedPost.NickName);
  console.log("삭제 Post title : " + deletedPost.title);
});

// var firebase = require('firebase');

// firebase.initializeApp({
//   serviceAccount: "public/keystore/univ2018-218305-cd9f82ee0831.json",
//   databaseURL:"https://dynamiclist-27cbe.firebaseio.com"
// });


/* GET home page. */
router.get('/', function(req, res) {
  firebase_admin_ref.once("value", (snapshot)=>{
    console.log(snapshot.val());

    res.render('firebase', { 
      title: 'Express',
      list : snapshot.val()
    });

  }, (errorObject)=>{
    console.log("The Read Failed... : " + errorObject.code);
    res.render('firebase', { 
      title: 'Express',
      list : "Error..."
    });
  })
});

//원래는 Post 지만, 예시 작업하기 귀찮아서 ㅎㅎ
router.get('/save', (req, res)=>{
  var saveData = req.query.save;

  if(saveData!=null){
    var UserREF = firebase_admin_ref.child("TestNode");
    //set : 지정된 하위 노드 덮어씀
    //update : 지정된 하위 노드 동시에 쓰기
    UserREF.set({
      Test2 : {
        NickName:saveData,
        writeDate : "2018-09-30 00:00:00"
      }
    }, (savingerror)=>{
      if(savingerror){
        console.log("Set ERROR");
      }else{
        UserREF.update({
          "Test1/NickName" : saveData,
          "Test2/NickName" : saveData
        }, (updatingerror)=>{
          if(updatingerror){
            console.log("Update ERROR");
          }else{
            res.status(200).send({
              result : "Complete",
              Code : "1001"
            });
          }
        });
      }
    });
  }
});

module.exports = router;