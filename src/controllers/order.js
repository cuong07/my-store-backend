const Order = require('../models/order');
const Cart = require('../models/cart');
const CartItem = require("../models/cart-item");
require("dotenv").config();
const jwt = require('jsonwebtoken');

exports.addOrder = async (req, res, next) => {
    const { userId, total, products } = req.body;
    let cart = await Cart.findOne({ where: { userId: userId } })
    if (!cart) {
        cart = await Cart.create({ userId });
    }
    try {
        const order = await Order.create({
            userId,
            cartId: cart.id,
            total,
            status: "order",
        });
        const promises = products.map(async (product) => {
            const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id } });
            if (cartItem) {
                // Nếu cartItem đã tồn tại, ta sẽ update lại quantity của nó
                await cartItem.update({ quantity: cartItem.quantity + product.quantity });
            } else {
                // Nếu cartItem chưa tồn tại, ta sẽ tạo mới
                await CartItem.create({
                    // cartId: cart.id,
                    productId: product.id,
                    quantity: product.quantity,
                    orderId: order.id,
                });
            }

        });
        await Promise.all(promises);
        res.status(200).send({ message: "Thêm dữ liệu thành công!" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Lỗi khi thêm dữ liệu", error });
    }
};

exports.getOrder = async (req, res) => {
    const token = req.headers.token;
    const accessToken = token.split(" ")[1];
    const user = jwt.verify(accessToken, process.env.SECRET_KEY)
    console.log(user?.id);
    Cart.findOne({ where: { userId: user.id } })
        .then((cart) => {
            Order.findAll({ where: { cartId: cart.id } })
                .then(async (orders) => {
                    console.log(orders.length);
                    const data = [];
                    const promises = orders.map(async (order) => {
                        const orderCartItem = await CartItem.findAll({ where: { orderId: order.id } });
                        if (orderCartItem) {
                            data.push(orderCartItem)
                        }
                    });
                    await Promise.all(promises);
                    res.status(200).send({ message: "Thêm dữ liệu thành công!", data: data });
                })
                .catch((error) => { console.log(error) })
        })
        .catch((error) => { console.log(error) })
}

exports.getAllOrder = async (req, res) => {
    Order.findAll()
        .then((orders) => {
            return res.status(200).json({ message: "success", data: orders });
        })
        .catch((error) => { console.log(error) })
}
