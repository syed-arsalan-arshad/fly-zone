const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const OrderStatus = sequelize.define('orderStatus' ,{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    statusName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    statusValue: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = OrderStatus;