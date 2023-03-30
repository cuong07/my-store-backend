const express = require('express')
const routes = express.Router();
const shopController = require("../controllers/shop")

routes.get('/products',)
routes.get('/products/:productType', shopController.getMensProduct)
routes.get("/:prductype/:id", shopController.getDetailProduct)

module.exports = routes;