const express = require('express');
const adminControllers = require('../controllers/admin')
const upload = require("../../multer")
const router = express.Router();

router.get('/products', adminControllers.getProducts)
router.post('/add-product', upload.array('image'), adminControllers.postAddProduct)
router.post('/remove-product', adminControllers.removeProduct)
router.get('/remove-product', adminControllers.removeProduct)

module.exports = router;