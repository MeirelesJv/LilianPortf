const express = require("express")
const connection = require("../database/database")
let app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/",(req,res) =>{
    res.json({});
})

connection.authenticate().then(() =>{
    console.log("Banco conectado!");
}).catch((error) =>{
    console.log(error);
})

const cors = require("cors")
app.use(cors())

module.exports = app;