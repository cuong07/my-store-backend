const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    const { token } = req.headers
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                res.status(403).json("Token is not invalid")
            }
            req.user = user;
        })
        next();
    } else {
        res.status(401).json("you're not authenticated");
    }

};

const verifyTokenAndAdminAuth = (req, res, next) => {
    const id = req.params.id;
    verifyToken(req, res, () => {
        if (req.user.id == id || req.user.admin) {
            next();
        } else {
            res.status(403).json("You're not allowed to delete other");
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAdminAuth
};
