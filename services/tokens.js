var mongoose=require("mongoose");
var tokenSchema=new mongoose.Schema({
  tokenId:{type:String,required:true,unique:true},
  creationDate:{type:Date,default:Date.now},
  expirationDate:{type:Date,default:null},
  associatedUser:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"users"}
})
var tokenData=mongoose.model("tokens",tokenSchema);
var Token={};

Token.create=function(data,callback){
  new_token=new tokenData(data);
  new_token.save(function(error,result){
    var errResponse;
    var response=null;
    if(error){
      console.log(error);
      if(error.errors.tokenId)
        errResponse={message:{TokenIdRequired:true}}
      else if(error.errors.associatedUser)
        errResponse={message:{AssociatedUserRequired:true}}
      else {
        errResponse={message:{CriticalDatabaseError:true}}
      }
    }
    else{
      response={message:{TokenCreated:true}}
    }
    callback(errResponse,response);
  })
}

Token.expire=function(tokenId,callback){
  tokenData.update({"tokenId":tokenId},{$set:{expirationDate:Date.now()}},function(error,numAffected){
    var errResponse;
    var response;
    if(error)
        errResponse={"message":{"CriticalDatabaseError":true}};
    else {
      if(numAffected==0)
        errResponse={"message":{"TokenExipiredOrDoesNotExist":true}}
      else {
        response={"message":{"TokenSuccessfullyExpired":true}}
      }
    }
    callback(errResponse,response);
  })
}

Token.checkValidity=function(tokenId,userHandle,callback){
  tokenData.findOne({"tokenId":tokenId}).populate("associatedUser","userHandle").exec(function(error,result){
    var errResponse;
    var response;
    if(error)
      errResponse={message:{"CriticalDatabaseError":true}};
    else {
      if(result==null)
        errResponse={message:{"InvalidToken":true}};
      else if((Date.now()-result.creationDate)/(24*60*60*1000)>15){
        errResponse={message:{"TokenExpired":true}};
        tokenData.update({"tokenId":tokenId},{$set:{"expirationDate":Date.now()}})
      }
      else if(result.expirationDate)
        errResponse={message:{"TokenExpired":true}};
      else if(result.associatedUser.userHandle!=userHandle)
        errResponse={message:{"InvalidToken":true}}
      else
        response={message:{TokenValid:true}};
    }
    callback(errResponse,response);
  })
}

module.exports=Token;
