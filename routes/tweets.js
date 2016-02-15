var router=require("express").Router();
var tweets=require("../controllers/tweets");
var authorise=require("../middlewares/authenticator");
var checkParams=require("../middlewares/checkParams");

router.route("/")
  .get(tweets.getAll);

router.route("/byAuthor/:userHandle")
  .get(tweets.getByAuthor)


module.exports=router;
