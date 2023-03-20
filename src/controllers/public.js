const cloudinary = require('../../cloudinary');
const fs = require('fs');
const Public = require('../models/public');

exports.postPublic = async (req, res, next) => {
    const uploader = async (path) => await cloudinary.uploads(path, "images");
    const urls = [];
    if (req.method === "POST") {
        const file = req.file;
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
    } else {
        res.status(405).json({
            err: "error"
        })
    }

    const title = req.body.title;
    const image = urls;
    const saleOff = req.body.saleOff;
    const publicId = req.body.id;
    Public.destroy({
        where: {
            id: 3
        }
    });
    if (publicId == "1") {
        Public.findOne({ where: { id: publicId } })
            .then(response => {
                response.title = title;
                response.image = image;
                response.saleOff = saleOff;
                return response.save();
            })
            .then(result => {
                console.log('Done!');
                res.redirect('/public')
            })
            .catch((err) => { console.log(err) })
    } else {
        Public.create({
            title: title,
            image: image,
            saleOff: saleOff,
        })
            .then(result => {
                console.log('Created Product');
                res.redirect('/public');
            })
            .catch(err => {
                console.log(err);
            });
    }

}

exports.getPublic = (req, res, next) => {
    Public.findByPk(1)
        .then(result => {
            res.status(200).json({
                message: "success",
                data: result
            });
        })
        .catch(err => console.log(err));
}