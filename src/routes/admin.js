const express = require('express');
const adminControllers = require('../controllers/admin')
const upload = require("../../multer")
const router = express.Router();

router.get('/products', adminControllers.getProducts)
router.get('/add-product', adminControllers.getAddProduct)
router.post('/add-product', upload.array('image'), adminControllers.postAddProduct)

module.exports = router;