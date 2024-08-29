const express = require("express");
const router = express.Router();
const project = require("../../database/projects");
const homeBase = require("../../database/home");
const JWTSecret = require("jsonwebtoken");
const authToken = require("../../middleware/authToken");

const userADM = "vZaVbQVr"

router.get("/", async (req, res) => {
    try {
        let projects = await project.findAll();
        let home = await homeBase.findAll();
        res.json({ projects, home });
        res.status(200);
    } catch (error) {
        res.status(500);
        res.json({ message: "Erro interno" + error });
    }
});

router.get("/login", async (req, res) => {
    let { password } = req.body

    //Valida se a senha não veio undefined
    if (password != undefined) {
        //valida se a senha é igual a registrada 
        if (password === userADM) {
            //retorna o token se estiver tudo certo
            try {
                var token = jwt.sign(JWTSecret, { expiresIn: '1h' });
                res.status(200);
                res.json({ token: token })
            } catch (error) {
                res.status(500);
                res.json({ message: "Erro interno" })
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

router.post("/project", authToken, async (req, res) => {
    let { name, nameing, text, texting, imgfile, route, dataproject } = req.body

    try {
        await project.create({
            Name: name,
            NameIng: nameing,
            Text: text,
            TextIng: texting,
            ImgFile: imgfile,
            Route: route,
            DataProject: dataproject
        });

        res.status(200);
    } catch (error) {
        res.status(500);
        res.json({ message: "Erro interno" + error });
    }

})

module.exports = router;