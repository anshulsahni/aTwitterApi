var tokens=require("../services/tokens");
var tweets=require("../models/tweets");
var user=require("../models/users");
var connected_users={};
module.exports=function(socket_io){
  //socket gets connected
  socket_io.on("connection",function(socket){
    var tokenId=socket.request._query.tokenId;
    var userHandle=socket.request._query.userHandle;
    tokens.checkValidity(tokenId,userHandle,function(error,result){
      if(error)
          socket.disconnect();
      else {
        if(result.message.TokenValid){
          connected_users[userHandle]=socket;
          user.getKey(userHandle,function(error,result){
            tweets.byAuthor(result.data._id,function(error,result){
                if(!error){
                  // var data={"content":result.data.content,"author":result.data.author.name,re}
                  socket.emit("TweetsIncoming",result);
                }
                else {
                  console.log(error);
                }
            })
          })
        }
      }
    })
    //socket gets disconnected
    socket.on("disconnect",function(){
      for(i in connected_users){
        if(connected_users[i]==socket){
          delete(connected_users[i]);
          break;
        }
      }
    })

    //tweet created event occurs from client
    socket.on("TweetCreated",function(data){
      tokens.checkValidity(data.tokenId,data.userHandle,function(error,result){
        if(error)
          socket.disconnect();
        else{
          if(result.message.TokenValid){
            user.getKey(data.userHandle,function(error,result){
              var id=result.data._id;
              tweets.create(data.content,id,function(error,result){
                tweets.get(result.data.tweetId,function(error,result){
                  socket.emit("TweetUpdate",result)
                })
              })
            })
          }
        }
      })
    })

  })





}
