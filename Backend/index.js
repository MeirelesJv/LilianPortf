const express = require("express");
const connection = require("./database/database");
let app = express();

app.listen(3000, ()=>{
    console.log("Servidor rodando!")
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());

connection.authenticate().then(() =>{
    console.log("Banco conectado!");
}).catch((error) =>{
    console.log(error);
})

const portfolio = require('./src/router/portfolio');
app.use("/", portfolio);

const cors = require("cors")
app.use(cors())