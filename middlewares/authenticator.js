var tokens=require("../services/tokens");
var respond=require("../services/responder");

module.exports=function(req,res,next){
  tokens.checkValidity(req.body.tokenId,req.body.userHandle,function(error,result){
    if(!error && result.message.TokenValid)
      next();      
    else
      respond(res,error,result);
  })
}
