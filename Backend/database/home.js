const sequelize = require("sequelize");
const connection = require("./database");

const Home = connection.define('Home', {
    Text1: {
        type: sequelize.STRING,
        allowNull: false
    },
    Text2: {
        type: sequelize.STRING,
        allowNull: false
    },
    ImgFile: {
        type: sequelize.STRING,
        allowNull: false
    },
    Route: {
        type: sequelize.STRING,
        allowNull: false
    },
})

Home.sync({ force: false }).then(() => { });
module.exports = Home;