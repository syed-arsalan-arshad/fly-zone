const Sequelize = require('sequelize');

const sequelize = new Sequelize('flyzone_db', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
