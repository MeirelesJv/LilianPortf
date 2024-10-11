const sequelize = require("sequelize");
const connection = require("./database");

const Home = connection.define('Home', {
    TextOne: {
        type: sequelize.STRING,
        allowNull: false
    },
    TextOneIng: {
        type: sequelize.STRING,
        allowNull: false
    },
    TextTwo: {
        type: sequelize.STRING,
        allowNull: false
    },
    TextTwoIng: {
        type: sequelize.STRING,
        allowNull: false
    },
    ImgFile: {
        type: sequelize.STRING,
        allowNull: false
    },
})

Home.sync({ force: false }).then(() => { });
module.exports = Home;