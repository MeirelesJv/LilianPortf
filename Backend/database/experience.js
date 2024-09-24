const sequelize = require("sequelize");
const connection = require("./database");

const Experience = connection.define('Experience', {
    Position: {
        type: sequelize.STRING,
        allowNull: false
    },
    PositionIng: {
        type: sequelize.STRING,
        allowNull: false
    },
    Text: {
        type: sequelize.STRING,
        allowNull: false
    },
    TextIng: {
        type: sequelize.STRING,
        allowNull: false
    },
    Logo: {
        type: sequelize.STRING,
        allowNull: false
    },
    ImgFile: {
        type: sequelize.STRING,
        allowNull: false
    },
})

Experience.sync({ force: false }).then(() => { });
module.exports = Experience;