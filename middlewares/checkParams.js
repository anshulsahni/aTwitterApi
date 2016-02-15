var respond=require("../services/responder");

module.exports=function(params){
  return function(req,res,next){
    console.log(req.body);
      if(params){
        for(i in params){
          if(!(req.body.hasOwnProperty(params[i]))){
            respond(res,{message:{"ParamMissing":params[i]}},null);
            return;
          }
        }
        next();
      }
  }
}
