const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const OrderList = sequelize.define("orderLists", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  productName: Sequelize.STRING,
  productMRP: Sequelize.INTEGER,
  productSalePrice: Sequelize.INTEGER,
  sellerName: Sequelize.STRING,
  sellerEmail: Sequelize.STRING,
  sellerMobile: Sequelize.STRING,
});
module.exports = OrderList;
