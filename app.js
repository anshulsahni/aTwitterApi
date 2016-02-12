var app=require("express")(),
    bodyParser=require("body-parser"),
    db=require("mongoose").connect("mongodb://localhost/atwitter"),
    http=require("http").Server(app);
    io=require("socket.io")(http);

var socket=require("./sockets/tweets")(io);



app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
var users=require("./routes/users");
app.use("/users",users);



http.listen(3000,function(){
  console.log("Server Listening Api is up");
})
