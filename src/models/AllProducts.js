const Sequelize = require('sequelize')
const sequelize = require("../../util/database")

const AllProducts = sequelize.define('AllProducts', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    images: {
        type: Sequelize.JSON
    },
    title: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.STRING
    },
    productType: {
        type: Sequelize.INTEGER
    }
})

module.exports = AllProducts