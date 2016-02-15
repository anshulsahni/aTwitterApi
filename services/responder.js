module.exports=function(res,error,response){
  if(error)
    res.send({error:true,message:error.message,status:500})
  else {
    res.send({error:false,message:response.message,body:response.data,status:200})
  }
}
