const Sequelize = require('sequelize');

const sequelize = require('../../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    admin: Sequelize.BOOLEAN,
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    username: Sequelize.STRING,
});

module.exports = User;
