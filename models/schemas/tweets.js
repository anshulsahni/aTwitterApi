var mongoose=require("mongoose");
var tweetScehma=new mongoose.Schema({
  content:{type:String,required:true},
  creationTime:{type:Date,default:Date.now},
  author:{type:mongoose.Schema.Types.ObjectId,ref:"users",required:true}
})

module.exports=mongoose.model("tweets",tweetScehma);
