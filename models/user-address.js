const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const UserAddress = sequelize.define('userAddress', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mobile: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pincode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    district: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = UserAddress;