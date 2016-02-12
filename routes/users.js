var router=require("express").Router();
var users=require("../controllers/users");
var authorise=require("../middlewares/authenticator");
var checkParams=require("../middlewares/checkParams")
router.route("/")
  .post(checkParams([
    "name",
    "userHandle",
    "password",
    "email"
  ]),users.signUp);

router.route("/sign_in")
  .post(checkParams([
    "userHandle",
    "password"
  ]),users.signIn)

router.route("/follow")
  .put(authorise,users.follow)

router.route("/unfollow")
  .put(authorise,users.unfollow);

router.route("/:userHandle/follow")
  .get(users.getFollow)

router.route("/all")
  .get(users.getAllUserHandles);

router.route("/:userHandle")
  .get(users.get);


module.exports=router;