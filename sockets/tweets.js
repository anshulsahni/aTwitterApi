var tokens=require("../services/tokens");
var tweets=require("../models/tweets");
var user=require("../models/users");
var mongoose=require("mongoose");
var connectedUsers={};
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
          connectedUsers[userHandle]=socket;
        }
      }
    })
    //socket gets disconnected
    socket.on("disconnect",function(){
      for(i in connectedUsers){
        if(connectedUsers[i]==socket){
          delete(connectedUsers[i]);
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
          var content=data.content;
          if(result.message.TokenValid){
            var contentArray=[];
            var prev=0;
            for(var i=0;i<content.length;i++){
              if(content[i]=="@" && (content[i-1]==" " || i==0)){
                var end=content.indexOf(" ",i+1);
                var tmp=(content.substring(i+1,end==-1?content.length:end));
                user.getKey(tmp,function(error,result){
                  if(!error){
                    if(connectedUsers[result.data.userHandle])
                      connectedUsers[result.data.userHandle].emit("TweetNotify",{author:data.userHandle,content:content});
                    user.addNotification(result.data.userHandle,{author:data.userHandle,content:content,read:false})
                  }
                })
              }
            }
            // if(prev!=content.length)
              // contentArray.push(content.substring(prev,content.length));
            // console.log(contentArray);
            contentArray.push(content);
            user.getKey(data.userHandle,function(error,result){
              var id=result.data._id;
              tweets.create(contentArray,id,function(error,result){
                tweets.get(result.data.tweetId,function(error,result){
                  socket.emit("TweetUpdate",result)
                })
              })
            })
          }
        }
      })
    })
    socket.on("FollowsTweets",function(data){
      tokens.checkValidity(data.tokenId,data.userHandle,function(error,result){
        if(error)
          socket.disconnect();
        else {
          if(result.message.TokenValid){
            tweets.byFollows(data.userHandle,function(error,result){
              if(!error){
                  socket.emit("TransferFollowsTweets",result);
              }
            })
          }
        }
      })
    })
    socket.on("DemandTweets",function(data){
      tweets.byAuthor(data.userHandle,function(error,result){
        if(!error){
          socket.emit("TweetsIncoming",result);
        }
      })
    })
    socket.on("AllTweets",function(){
      tweets.allTweets(function(error,result){
        if(!error)
          socket.emit("TransferAllTweets",result);
      })
    })
  })





}
