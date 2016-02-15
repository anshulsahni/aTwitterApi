var tweetModal=require("../models/tweets");
var respond=require("../services/responder");
var TweetController={};

TweetController.getAll=function(req,res){
  tweetModal.allTweets(function(error,result){
    respond(res,error,result);
  })
}

TweetController.getByAuthor=function(req,res){
  tweetModal.byAuthor(req.params.userHandle,function(error,result){
    respond(res,error,result);
  })
}

module.exports=TweetController;
