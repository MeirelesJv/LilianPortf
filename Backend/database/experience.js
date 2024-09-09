const sequelize = require("sequelize");
const connection = require("./database");

const Experience = connection.define('Experience', {
    Position: {
        type: sequelize.STRING,
        allowNull: false
    },
    TextPort: {
        type: sequelize.STRING,
        allowNull: false
    },
    TextIng: {
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

Experience.sync({ force: false }).then(() => { });
module.exports = Experience;