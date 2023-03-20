const express = require('express');
const adminControllers = require('../controllers/admin');
const publicControllers = require('../controllers/public');
const upload = require("../../multer")
const router = express.Router();

router.get('/products', adminControllers.getProducts)
router.post('/add-product', upload.array('image'), adminControllers.postAddProduct)
router.post('/remove-product', adminControllers.removeProduct)
router.get('/remove-product', adminControllers.removeProduct)
router.post('/update-public', upload.single('image'), publicControllers.postPublic)
router.get('/public', publicControllers.getPublic);

module.exports = router;