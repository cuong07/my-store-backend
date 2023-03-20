const Products = require("../models/products");
const cloudinary = require('../../cloudinary');
const fs = require('fs');
const Product = require("../models/products");

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
    } else {
        res.status(405).json({
            err: "error"
        })
    }
    console.log(urls);
    const title = req.body.title;
    const price = req.body.price;
    const image = urls;
    const description = req.body.description;
    const total = req.body.total;
    const category = req.body.category;
    req.user
        .createProduct({
            title: title,
            image: image,
            price: price,
            description: description,
            total: total,
            category: category
        })
        .then(response => {
            console.log('Done!');
            res.redirect('add-product')
        })
        .catch(err => {
            console.log("🚀 ~ file: admin.js:44 ~ exports.postAddProduct= ~ err:", err)
        })
    res.status(200).json({
        message: "successfully",
        data: {
            title: title,
            image: image,
            price: price,
            description: description,
            total: total,
            category: category
        }
    })
}

exports.getProducts = async (req, res, next) => {
    const result = await req.user?.getProducts();
    res.status(200).json({
        message: "successfully",
        data: result
    })
}

exports.removeProduct = async (req, res, next) => {
    Product.findByPk(3)
        .then(product => {
            res.status(200).json({
                message: "successfully",
                data: product
            })
        })
        .catch(err => console.log(err))
    // const prodId = req.body.title;
    // console.log(prodId);
    // res.redirect('/products')
    // Product.destroy({
    //     where: {
    //         id: prodId
    //     },
    //     force: true
    // })
    //     .then((response) => {
    //         res.redirect('/admin/products')
    //     })
    //     .catch((err) => { console.log(err) });
}