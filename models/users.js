var userData=require("./schemas/users");
var token=require("../services/tokens");
var hash=require("../services/hashing");
var User={};

User.signUp=function(data,callback){
  data.password=hash(data.password);
  new_user=new userData(data);
  new_user.save(function(error,result){
    var errResponse;
    var response=null;
    if(error){
      if(error.code==11000){
        var param=error.errmsg.substring(error.errmsg.indexOf("$")+1,error.errmsg.indexOf("_"));
        errResponse={message:{"FieldRepeated":param}};
      }
      else {
        errResponse={message:{"CriticalDatabaseError":true}};
      }
    }
    else {
      response={message:{"UserCreated":true}}
    }
    callback(errResponse,response);
  })
}

User.signIn=function(credentials,callback){
    userData.findOne({userHandle:credentials.userHandle,password:hash(credentials.password)},function(error,result){
      var errResponse;
      var response;
      if(error){
       errResponse={message:{CriticalDatabaseError:true}};
       callback(errResponse,response);
      }
      else {
        if(!result){
          errResponse={message:{InvalidEmailOrPassword:true}};
          callback(errResponse,response);
        }
        else{
          new_tokenId=hash(Date.now()+result._id)
          token.create({
            "tokenId":new_tokenId,
            "associatedUser":result._id
          },function(error,result){
            if(error)
              errResponse={message:{CriticalDatabaseError:true}};
            else{
              response={message:{TokenCreated:true},data:{tokenId:new_tokenId,creationDate:result.creationDate}}
            }
            callback(errResponse,response);
          })
        }
      }
    })
}

User.follow=function(userHandle,followHandle,callback){
  if(userHandle==followHandle){
    callback({message:{BothHandlesSame:true}},null);
    return;
  }
  userData.findOne({"userHandle":followHandle},{_id:1},function(error,result){
    var errResponse;
    var response;
    if(error){
      errResponse={message:{CriticalDatabaseError:true}}
      callback(errResponse,response);
    }
    else{
      if(!result){
          errResponse={message:{InvalidFollowHandle:true}}
          callback(errResponse,response);
        }
      else {
        userData.update({userHandle:userHandle},{$addToSet:{follow:result._id}},function(error,num){
          if(error)
            errResponse={message:{CriticalDatabaseError:true}}
          else
            response={message:{UserFollowed:true}}
          callback(errResponse,response);
        })
      }
    }
  })
}

User.unfollow=function(userHandle,unfollowHandle,callback){
  if(userHandle==unfollowHandle){
    callback({message:{BothHandlesSame:true}},null);
    return;
  }
  userData.findOne({"userHandle":unfollowHandle},{_id:1},function(error,result){
    var errResponse;
    var response;
    if(error){
      errResponse={message:{CriticalDatabaseError:true}}
      callback(errResponse,response);
    }
    else{
      if(!result){
          errResponse={message:{InvalidUnfollowHandle:true}}
          callback(errResponse,response);
        }
      else {
        userData.update({userHandle:userHandle},{$pull:{follow:result._id}},function(error,num){
          if(error)
            errResponse={message:{CriticalDatabaseError:true}}
          else
            response={message:{UserUnFollowed:true}}
          callback(errResponse,response);
        })
      }
    }
  })
}

User.get=function(userHandle,callback){
  var errResponse;
  var response;
  userData.findOne({"userHandle":userHandle},{"_id":0,"__v":0}).populate("follow","-follow -_id -__v").exec(function(error,result){
    if(error)
      errResponse={message:{CriticalDatabaseError:true}};
    else if(result==null)
     errResponse={message:{UserNotFound:true}}
    else
      response={message:{UserFound:true},data:result}
    callback(errResponse,response);
  })
}

User.getKey=function(userHandle,callback){
  var errResponse;
  var response;
  userData.findOne({"userHandle":userHandle},{"_id":1},function(error,result){
    if(error)
      errResponse={message:{"CriticalDatabaseError":true}}
    else{
      if(!result)
        errResponse={message:{"InvalidUserHandle":true}}
      else {
        response={message:{"UserKeyFound":true},data:result}
      }
    }
    callback(errResponse,response);
  })
}

User.getAllUserHandles=function(callback){
  var errResponse;
  var response;
  userData.find({},{"userHandle":1},{"_id":0},function(error,result){
    if(error)
      errResponse={message:{"CriticalDatabaseError":true}};
    else{
      var handles=[]
      for(i in result){
        handles.push(result[i].userHandle)
      }
      response={message:{"AllUserHandles":true},data:handles};
    }
    callback(errResponse,response);
  })
}

User.getFollow=function(userHandle,callback){
  var errResponse;
  var response;
  userData.findOne({userHandle:userHandle},{follow:1}).populate("follow","-follow -_id -__v").exec(function(error,result){
    if(error)
      errResponse={message:{"CriticalDatabaseError":true}};
    else {
      if(!result)
        result=[]
      response={message:{"FollowUsers":true},data:result.follow};
    }
    callback(errResponse,response);
  })
}
module.exports=User;
