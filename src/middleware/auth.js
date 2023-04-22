const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not invalid")
            }
            req.user = user;
        })
        next();
    } else {
        res.status(403).json("you're not authenticated");
    }
};

const verifyTokenAndAdminAuth = async (req, res, next) => {
    const token = req.headers.token;
    console.log(">>>>>>>>>>>" + token);
    try {
        const accessToken = token.split(" ")[1];
        let user = jwt.verify(accessToken, process.env.SECRET_KEY)
        if (user.id == req.params.id || user.admin) {
            req.user = user;
            next();
        } else {
            res.status(403).json("You're not allowed to delete other");
        }
    } catch (error) {
        res.status(403).json("Token is not invalid")
    }
}

module.exports = {
    verifyToken,
    verifyTokenAndAdminAuth
};
