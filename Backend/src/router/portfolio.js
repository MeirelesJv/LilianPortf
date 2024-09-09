const express = require("express");
const router = express.Router();
const keys = require("../../keys");
const project = require("../../database/project");
const homeBase = require("../../database/home");
const authToken = require("../../middleware/authToken");
const jwt = require("jsonwebtoken");
const upload = require("../../middleware/multer");
const { where } = require("sequelize");
const path = require("path")
const fs = require("fs")

router.get("/", async (req, res) => {
    try {
        let projects = await project.findAll();
        let home = await homeBase.findAll();
        res.json({ projects, home });
        res.status(200);
    } catch (error) {
        res.status(500);
        res.json({ message: "Erro interno " + error });
    }
});

router.get("/login", async (req, res) => {
    let { password } = req.body

    //Valida se a senha não veio undefined
    if (password != undefined) {
        //valida se a senha é igual a registrada 
        if (password === keys.userADM) {
            //retorna o token se estiver tudo certo
            try {
                var token = jwt.sign({}, keys.JWTSecret, { expiresIn: '1h' });
                res.status(200);
                res.json({ token: token })
            } catch (error) {
                res.status(500);
                res.json({ message: "Erro interno " + error })
            }
        } else {
            res.status(401);
            res.json({ message: "Senha inválida" })
        }
    } else {
        res.status(401);
        res.json({ message: "Senha inválida" })
    }
});

router.post("/home", async (req,res) =>{

});

router.post("/project", [authToken, upload.single('file')], async (req, res) => {
    let { name, nameing, text, texting, dataproject } = req.body
    let file = req.file

    project.create({
        Name: name,
        NameIng: nameing,
        Text: text,
        TextIng: texting,
        ImgFile: file.filename,
        DataProject: dataproject
    }).then(() => {
        return res.status(200).json({message: "Succes"});
    }).catch(error => {
        res.status(500);
        res.json({ message: "Erro interno " + error });
    })

});

router.delete("/project/:id", authToken, async (req, res) => {

    let id = req.params.id
    let projeto = await project.findOne({ where: { id: id } });
    let pastaDoProjeto = __dirname;
    let caminhoFoto = path.join(pastaDoProjeto, '../../upload/' + projeto.ImgFile)

    if (projeto != undefined && projeto != null) {

        project.destroy({ where: { id: id, } })
            .then(() => {
                fs.unlink(caminhoFoto, (err) => {
                    if (err) {
                        res.json({ message: err })
                    } else {
                        return res.status(200).json({ message: "Succes" });
                    }
                });
            })
            .catch(erro => {
                res.status(500);
                res.json({ message: "Erro interno " + erro });
            })

    } else {
        res.status(500);
        res.json({ message: "Projeto não encontrado " });
    }


});



module.exports = router;