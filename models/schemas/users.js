var mongoose=require("mongoose");

var userSchema=new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,unique:true,required:true},
  password:{type:String,required:true,select:false},                    //stored using md5 hash
  userHandle:{type:String,unique:true,required:true},          //unique userHandle for user to identifiy themeselves
  follow:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
  creationTime:{type:Date,default:Date.now,select:false}
})

module.exports=mongoose.model("users",userSchema);
