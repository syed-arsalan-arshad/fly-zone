const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      title: Sequelize.STRING,
      mrp: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      mainImage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      smallFront: {
        type: Sequelize.STRING,
        allowNull: false
      },
      smallBack: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      salePrice: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
});

module.exports = Product;