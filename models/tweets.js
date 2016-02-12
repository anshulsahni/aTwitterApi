var tweetData=require("./schemas/tweets");
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
      response={message:{"TweetCreated":true},data:{tweetId:new_tweet._id}}
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
        response={message:{"TweetFound":true},data:result};
      }
    }
    callback(errResponse,response);
  })
}

Tweet.byAuthor=function(authorId,callback){
  tweetData.find({"author":authorId},{"__v":0}).sort({creationTime:-1}).populate("author","-_id -__v").exec(function(error,result){
    var errResponse;
    var response;
    if(error)
      errResponse={message:{"CriticalDatabaseError":true}}
    else {
      if(result==null)
        result=[];
      response={message:{"TweetsByAuthor":true},data:result}
    }
    callback(errResponse,response);
  })
}

module.exports=Tweet;
