const sequelize = require("sequelize");
const connection = require("./database");

const Project = connection.define('Project', {
    Name: {
        type: sequelize.STRING,
        allowNull: false
    },
    NameIng: {
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
    ImgFile: {
        type: sequelize.STRING,
        allowNull: false
    },
    Route: {
        type: sequelize.STRING,
        allowNull: false
    },
    DataProject: {
        type: sequelize.DATE,
        allowNull: false
    }
});

Project.sync({ force: false }).then(() => { });
module.exports = Project;