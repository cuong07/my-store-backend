const express = require('express')
const routes = express.Router();
const shopController = require("../controllers/shop")

routes.get('/products/:category', shopController.getProducts)
routes.get("/:prductype/:id", shopController.getDetailProduct)
routes.get("/product", shopController.getAllProducts)

module.exports = routes;