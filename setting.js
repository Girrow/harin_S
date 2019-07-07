module.exports = {
    server_port: 80,
    server_session: {
        secret:"keyboard cat",
        resave:false,
        saveUninitialized:true
    },
    jdbc : {
      connectionLimit:1,
      host:"192.168.3.169",
      user:"root",
      password:"1234",
      database:"test",
      debug:false
    }
};
