const { response } = require("express");
const Products = require("../models/products");
const cloudinary = require('../../cloudinary');
const fs = require('fs');
const { JSON } = require("sequelize");

exports.getProducts = (req, res, next) => {

}

exports.postAddProduct = async (req, res, next) => {
    const uploader = async (path) => await cloudinary.uploads(path, "node-mystore")
    const urls = [];
    if (req.method === "POST") {
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        res.status(200).json({
            message: "successfully",
            data: urls
        })
    } else {
        res.status(405).json({
            err: "error"
        })
    }
    const title = req.body.title;
    const image = urls;
    const price = req.body.price;
    const description = req.body.description;
    const total = req.body.total;
    req.user
        .createProduct({
            title: title,
            image: image,
            price: price,
            description: description,
            total: total
        })
        .then(response => {
            console.log('Done!');
            res.redirect('add-product')
        })
        .catch(err => {
            console.log("🚀 ~ file: admin.js:14 ~ err:", err)
        })
}
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product')
}