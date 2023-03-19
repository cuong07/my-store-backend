const Sequelize = require('sequelize');

const sequelize = require('../../util/database')

const Public = sequelize.define('public', {
    image: {
        type: Sequelize.JSON,
    },
    title: {
        type: Sequelize.STRING,
    },
    saleOff: {
        type: Sequelize.INTEGER,
    }
});

export default Public;