const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require("dotenv").config();

let refreshTokens = [];

const generateToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user.id, admin: user.admin },
        process.env.SECRET_KEY,
        { expiresIn: "365d" }
    );
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user.id, admin: user.admin },
        process.env.SECRET_REFRESHTOKEN_KEY,
        { expiresIn: "365d" }
    );
}

exports.signup = async (req, res) => {
    const { username, email, password, name } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email: email } })
        if (existingUser) {
            return res.status(400).json({ message: "email đã tồn tại. mời sử dụng email khác để đăng ký" })
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const result = User.create({
            email: email,
            username: username,
            password: hashedPassword,
            name: name,
            admin: false,
        })
        const token = generateToken(result);
        res.status(201).json({
            user: result,
            token: token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
}

exports.signin = async (req, res) => {
    const { password, email } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email: email } })
        if (!existingUser) {
            return res.status(404).json({ message: "Không tìm thây người dùng" })
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Mật khẩu không đúng mời nhập lại" })
        }
        const token = generateToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);
        console.log(refreshToken);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: 'none'
        })
        res.status(201).json({
            user: existingUser,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
}

exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json("Token is not valid");
    try {
        const user = jwt.verify(refreshToken, process.env.SECRET_REFRESHTOKEN_KEY);
        refreshTokens = refreshTokens.filter(token => token !== refreshToken)
        const newToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: 'none'
        })
        res.status(200).json(newToken)
        next();
    } catch (error) {
        console.log(error);
    }
};

exports.getUsers = (req, res) => {
    User.findAll()
        .then(users => {
            return res.status(200).json({ message: "success", data: users });
        })
        .catch(err => console.log(err))
}


exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json("deleted");
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.userLogout = (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
    res.status(200).json("Logout successfully6");
}