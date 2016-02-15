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
  ]),users.signUp)
  .get(users.getAllUsers)

router.route("/sign_in")
  .post(checkParams([
    "userHandle",
    "password"
  ]),users.signIn)

router.route("/sign_out")
  .put(authorise,users.signOut)

router.route("/follow")
  .put(authorise,users.follow)

router.route("/unfollow")
  .put(authorise,users.unfollow)

router.route("/notifications")
  .post(authorise,users.getNotifications)

router.route("/notifications/unread")
  .post(authorise,users.getUnreadNotif)

router.route("/notifications/read")
  .put(authorise,users.markNotifRead)

router.route("/:userHandle/follow")
  .get(users.getFollow)

router.route("/all")
  .get(users.getAllUserHandles);

router.route("/:userHandle")
  .get(users.get);


module.exports=router;
