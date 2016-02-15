var userModel=require("../models/users");
var respond=require("../services/responder");
var UserController={};

UserController.signUp=function(req,res){
  userModel.signUp(req.body,function(error,result){
    respond(res,error,result);
  })
}

UserController.signIn=function(req,res){
  userModel.signIn(req.body,function(error,result){
    respond(res,error,result);
  })
}

UserController.signOut=function(req,res){
  userModel.signOut(req.body.tokenId,function(error,result){
    respond(res,error,result);
  })
}

UserController.follow=function(req,res){
  userModel.follow(req.body.userHandle,req.body.followHandle,function(error,result){
    respond(res,error,result);
  })
}

UserController.unfollow=function(req,res){
  userModel.unfollow(req.body.userHandle,req.body.unfollowHandle,function(error,result){
    respond(res,error,result);
  })
}

UserController.get=function(req,res){
  userModel.get(req.params.userHandle,function(error,result){
    respond(res,error,result);
  })
}

UserController.getAllUserHandles=function(req,res){
  userModel.getAllUserHandles(function(error,result){
    respond(res,error,result);
  })
}

UserController.getFollow=function(req,res){
  userModel.getFollow(req.params.userHandle,function(error,result){
    respond(res,error,result);
  })
}

UserController.getAllUsers=function(req,res){
  userModel.getAllUsers(function(error,result){
    respond(res,error,result);
  })
}

UserController.getNotifications=function(req,res){
  userModel.getNotifications(req.body.userHandle,function(error,result){
    respond(res,error,result);
  })
}

UserController.getUnreadNotif=function(req,res){
  userModel.getUnreadNotif(req.body.userHandle,function(error,result){
    respond(res,error,result);
  })
}

UserController.markNotifRead=function(req,res){
  userModel.markNotificationsRead(req.body.userHandle,function(error,result){
    respond(res,error,result);
  })
}
module.exports=UserController;
