const express = require('express');
const adminRoutes = require('./src/routes/admin')
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');

const Products = require('./src/models/products')
const User = require('./src/models/users');
const sequelize = require('./util/database')

require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

Products.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Products)

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use(adminRoutes);



sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
        // console.log(result);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Cuong', email: 'test@test.com' });
        }
        return user;
    })
    .then(user => {
        app.listen('3000', () => {
            console.log('server running on port: http://localhost:3000');
        })
    })
    .catch(err => {
        console.log(err);
    });

