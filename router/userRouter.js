const express = require('express');
const router = express.Router();
const { userController,getuser, userSignup, userSignin, userSignout, usersendmail, userforgetlink, userresetpassword} = require('../controller/userController');
const { isAuthenticated } = require('../middleware/auth');



router.get('/', userController);
// router.post()

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/user",isAuthenticated,getuser);
router.get("/signout", isAuthenticated, userSignout);
router.post("/send-mail", usersendmail);
router.post("/forgot-password-link/:userId", userforgetlink);
router.post("/reset-password/:userId", isAuthenticated, userresetpassword);


module.exports = router;
