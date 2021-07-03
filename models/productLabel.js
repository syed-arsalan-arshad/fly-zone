const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ProductLabel = sequelize.define('productLabel', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    label: {
        type: Sequelize.STRING,
        allowNull: false
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = ProductLabel;