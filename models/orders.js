const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Orders = sequelize.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    orderNo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    orderValue: {
        type: Sequelize.STRING,
        allowNull: false
    },
    paymentMode: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
module.exports = Orders;