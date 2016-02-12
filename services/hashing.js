//module hashing the data with md5 hash

var md5=require("md5");
module.exports=function(data){
  return md5("54123"+data+"54123");
}
