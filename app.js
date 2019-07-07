const express=require("express");
const path=require("path")
const body_parser=require("body-parser");
const engine=require("ejs")
const db=require("mariadb");
const app=express();
const setting=require("./setting.js");

const server={
  RUN:()=>{
    console.log(__dirname);
    app.set("port", setting.server_port);
    app.set("views", path.join(__dirname, "./static"));
    app.use(express.static(path.join(__dirname, "./static")));
    app.use(body_parser.urlencoded({extended:false}));
    app.use(body_parser.json());
    app.engine("html", engine.renderFile);
    server.STEP_1();
  },
  STEP_1:()=>{
    const router=express.Router();
    router.route("/").get((req,res)=>{
      res.render("./index.html");
    });

    app.use("/",router);
    app.listen(app.get("port"),()=>{
      console.log(`${app.get("port")}aaaa`);
    });
  },
  DB : (sql, paramMap, callback) => {
      var 풀 = db.createPool(setting.jdbc);
      풀.getConnection().then((conn) => {
            conn.query(sql, paramMap).then((res) => {
                conn.end();
                callback(null, res);
            }).catch((err) => {
                console.log(err);
                conn.end();
                callback(err, null);
            });
      }).catch((err) => {
          console.log(err);
          callback(err, null);
      });
  }
};
server.RUN();
