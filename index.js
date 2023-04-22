const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');

const adminRoutes = require('./src/routes/admin')
const shopRoutes = require('./src/routes/shop')
const userRoutes = require('./src/routes/user')
const orderRoutes = require("./src/routes/order")

const Products = require('./src/models/products')
const User = require('./src/models/users');
const sequelize = require('./util/database');
const Cart = require('./src/models/cart');
const CartItem = require('./src/models/cart-item');
const Order = require('./src/models/order');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());


User.hasMany(Products, { onDelete: 'cascade' });
User.hasMany(Cart);
Products.belongsTo(User);
User.hasMany(Cart);
Cart.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
Cart.hasMany(Order);
Order.belongsTo(Cart);
Cart.belongsToMany(Products, { through: CartItem });
Products.belongsToMany(Cart, { through: CartItem });
Products.belongsToMany(Order, { through: CartItem });
Order.belongsToMany(Products, { through: CartItem });

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);




app.use("/api", adminRoutes);
app.use("/api", shopRoutes);
app.use("/api/user", userRoutes);
app.use("/api", orderRoutes);

app.get((req, res) => {
    res.status(404).send('Sorry, resource not found');
});
app.get('/', (req, res) => {
    res.send('Hello from Vercel!')
})

sequelize
    .sync()
    .then(user => {
        app.listen('5000', () => {
            console.log('server running on port: http://localhost:5000');
        })
    })
    .catch(err => {
        console.log(err);
    });

