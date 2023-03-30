const express = require('express');
const userControlllers = require('../controllers/user');
const auth = require('../middleware/auth');
const router = express.Router();

router.post("/signup", userControlllers.signup);
router.post("/signin", userControlllers.signin);
router.get("/", auth.verifyToken, userControlllers.getUsers);
router.post("/delete/:id", auth.verifyTokenAndAdminAuth, userControlllers.deleteUser);
router.post("/logout", auth.verifyToken, userControlllers.userLogout);
//
router.post("/refresh", userControlllers.refreshToken)

module.exports = router;