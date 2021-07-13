const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const OrderList = sequelize.define('orderLists', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
module.exports = OrderList;