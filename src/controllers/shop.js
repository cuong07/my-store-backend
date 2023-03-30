const AllProducts = require("../models/AllProducts")

exports.getMensProduct = (req, res) => {
    AllProducts.findAll({ where: { productType: req.params.productType } })
        .then((Products) => {
            res.status(200).json({
                message: "succsesfully",
                data: Products
            })
        })
        .catch((err) => { console.log(err) })
}

exports.getDetailProduct = (req, res) => {
    AllProducts.findOne({ where: { id: req.params.id } })
        .then((product) => {
            res.status(200).json({
                message: "successfully",
                data: product
            })
        })
        .catch(err => console.log(err))
}




