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
    const title = req.body.title;
    const price = req.body.price;
    const image = JSON.stringify(urls);
    const description = req.body.description;
    const total = req.body.total;
    const category = req.body.category;
    const id = req.body.id;
    console.log(req.body.id);
    try {
        const response = await Products.create({
            title: title,
            image: image,
            price: price,
            description: description,
            total: total,
            category: category,
            userId: id
        });
        res.status(200).json({
            message: "Thêm thành công",
            data: {
                title: response.title,
                image: response.image,
                price: response.price,
                description: response.description,
                total: response.total,
                category: response.category
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Có lỗi xảy ra khi thêm sản phẩm"
        });
    }
}


exports.getProducts = async (req, res, next) => {
}

exports.removeProduct = async (req, res, next) => {
}