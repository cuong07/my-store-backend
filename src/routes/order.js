const express = require('express');
const router = express.Router();
const orderController = require("../controllers/order")
const auth = require("../middleware/auth")

router.post("/order", auth.verifyToken, orderController.addOrder)
router.get("/user-order", auth.verifyToken, orderController.getOrder)
router.get("/all-order", auth.verifyTokenAndAdminAuth, orderController.getAllOrder)

module.exports = router;