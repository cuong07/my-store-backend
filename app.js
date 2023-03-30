const express = require('express');
const cors = require('cors');
const path = require('path')
const bodyParser = require('body-parser');
require('dotenv').config()
const cookieParser = require("cookie-parser");

const adminRoutes = require('./src/routes/admin')
const shopRoutes = require('./src/routes/shop')
const userRoutes = require('./src/routes/user')

const Products = require('./src/models/products')
const User = require('./src/models/users');
const sequelize = require('./util/database');
const AllProducts = require('./src/models/AllProducts');
const productsData = require('./data/products')


const app = express();



app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

Products.belongsTo(User, { constraints: false });
User.hasMany(Products)

app.use(cors())

// app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err));
// });




app.use("/api", adminRoutes);
app.use("/api", shopRoutes);
app.use("/api/account", userRoutes);


// app.use(async (req, res, next) => {
//     const allProducts = [
//         ...productsData.womensProducts.map(p => ({ ...p, productType: 2 })),
//         ...productsData.mensProducts.map(p => ({ ...p, productType: 1 })),
//         ...productsData.topsProducts.map(p => ({ ...p, productType: 3 })),
//         ...productsData.bottomsProducts.map(p => ({ ...p, productType: 4 })),
//         ...productsData.accessoriesProducts.map(p => ({ ...p, productType: 5 })),
//         ...productsData.outerweasProducts.map(p => ({ ...p, productType: 6 }))
//     ];

//     try {
//         await Promise.all(allProducts.map(product =>
//             AllProducts.create({
//                 title: product.title,
//                 images: product.images,
//                 price: product.price,
//                 productType: product.productType,
//             })
//         ));
//         console.log('All products created successfully');
//         next();
//     } catch (err) {
//         console.error('Error creating products:', err);
//         next(err);
//     }
// });


sequelize
    // .sync({ force: true })
    .sync()
    // .then(result => {
    //     return User.findByPk(1);
    // })
    // .then(user => {
    //     if (!user) {
    //         return User.create({ name: 'Cuong', email: 'test@test.com' });
    //     }
    //     return user;
    // })
    .then(user => {
        app.listen('5000', () => {
            console.log('server running on port: http://localhost:5000');
        })
    })
    .catch(err => {
        console.log(err);
    });

