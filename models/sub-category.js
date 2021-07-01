const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const SubCategory = sequelize.define('subCategory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    sub_cat_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

});

module.exports = SubCategory;