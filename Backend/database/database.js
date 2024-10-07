const sequelize = require("sequelize");
const key = require('../keys');

const connection = new sequelize(key.database,key.databaseLogin,key.databasePassword,{
    host: 'localhost',
    dialect: 'mssql',
    timezone: '-03:00',
    dialectOptions: {
    ssl: {
      rejectUnauthorized: false // Equivalente a trustServerCertificate: true
    }
  }
});

module.exports = connection;