var tweetData=require("./schemas/tweets");
var users=require("./users");
var mongoose=require("mongoose");
var Tweet={};

Tweet.create=function(content,author,callback){
  new_tweet=new tweetData({"author":author,"content":content});
  new_tweet.save(function(error,result){
    var errResponse;
    var response;
    if(error){
      errResponse={message:{"CriticalDatabaseError":true}};
    }
    else {
      response={message:{"TweetCreated":true},data:{tweetId:new_tweet._id,creationTime:new_tweet.creationTime}}
    }
    callback(errResponse,response);
  })
}

Tweet.get=function(tweetId,callback){
  var errResponse;
  var response;
  tweetData.findOne({"_id":tweetId},{"__v":0}).populate("author","-_id -__v").exec(function(error,result){
    if(error)
      errResponse={message:{"CriticalDatabaseError":true}}
    else{
      if(result==null)
        errResponse={message:{"TweetNotFound":true}}
      else {
        result.content=result.content.join(" ");
        response={message:{"TweetFound":true},data:result};
      }
    }
    callback(errResponse,response);
  })
}

Tweet.byAuthor=function(authorId,callback){
  users.getKey(authorId,function(error,result){
      var id=result.data._id;
      tweetData.find({"author":id},{"__v":0}).sort({creationTime:-1}).populate("author","-_id -__v").exec(function(error,result){
        var errResponse;
        var response;
        console.log(error);
        if(error)
          errResponse={message:{"CriticalDatabaseError":true}}
        else {
          if(result==null)
            result=[];
          else
            for(i in result) {result[i].content=result[i].content.join(" ");}
          response={message:{"TweetsByAuthor":true},data:result}
        }
        callback(errResponse,response);
      })
    })
  }

Tweet.byFollows=function(userHandle,callback){
  var errResponse;
  var response;
  users.getFollows(userHandle,function(error,result){
    if(error){
      errResponse={message:{CriticalDatabaseError:true}};
      callback(errResponse,response);
    }
    else {
      tweetData.find({author:{$in:result.data}}).sort({creationTime:-1}).populate("author","-_id -__v").exec(function(error,result){
        if(error)
          errResponse={message:{CriticalDatabaseError:true}};
        else {
          response={message:{FollowsTweets:true},data:result};
        }
        callback(errResponse,response);
      })
    }
  })
}

Tweet.allTweets=function(callback){
  var errResponse;
  var response;
  tweetData.find({},{"__v":0}).sort({creationTime:-1}).populate("author","-_id -__v").exec(function(error,result){
    if(error)
      errResponse={message:{CriticalDatabaseError:true}};
    else{
      response={message:{allTweets:true},data:result}
    }
    callback(errResponse,response);
  })
}

module.exports=Tweet;
