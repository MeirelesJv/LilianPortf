const express = require("express");
const router = express.Router();
const keys = require("../../keys");
const project = require("../../database/project");
const homeBase = require("../../database/home");
const experience = require("../../database/experience");
const authToken = require("../../middleware/authToken");
const jwt = require("jsonwebtoken");
const upload = require("../../middleware/multer");
const path = require("path")
const fs = require("fs");
const { where } = require("sequelize");

//Rota para pegar Tabelas  ✓
router.get("/", async (req, res) => {
    try {
        let projects = await project.findAll();
        let home = await homeBase.findAll();
        let experiences = await experience.findAll();
        res.json({ projects, home, experiences });
        res.status(200);
    } catch (error) {
        res.status(500);
        res.json({ message: "Erro interno " + error });
    }
});

//Pegar o token para edição ✓
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

//Rota de update da tabela Home
router.post("/home", authToken, async (req, res) => {
    let { textone, textoneing, texttwo, twxttwoing, } = req.body
    let id = '2'

    homeBase.update({
        TextOne: textone,
        TextOneIng: textoneing,
        TextTwo: texttwo,
        TextTwoIng: twxttwoing,

    },{where: {id: id}})
    .then(() => {
        return res.status(200).json({ message: "Succes" });
    }).catch(error => {
        res.status(500);
        res.json({ message: "Erro interno " + error });
    })

});

//Rota de update da foto principal ✓
router.post("/home/file", [authToken, upload.single('file')], async (req, res) => {

    let home = await homeBase.findOne({where: {Base: 'base'}});
    let pastaDoProjeto = __dirname;
    let caminhoFoto = path.join(pastaDoProjeto, '../../upload/' + home.ImgFile)

    homeBase.update({
        ImgFile: req.file.filename,
    },{where: {Base: 'base'}})
    .then(() => {
        fs.unlink(caminhoFoto, (err) => {
            if (err) {
                res.json({ message: err })
            } else {
                return res.status(200).json({ message: "Succes" });
            }
        });
    }).catch(error => {
        res.status(500);
        res.json({ message: "Erro interno " + error });
    })

});

//Rota de criação de um projeto  ✓
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
        return res.status(200).json({ message: "Succes" });
    }).catch(error => {
        res.status(500);
        res.json({ message: "Erro interno " + error });
    })

});

//Rota de edição de um projeto
router.post("/project/:id", authToken, async (req, res) => {
    let idProject = req.params.id;
    let { name, nameing, text, texting, dataproject } = req.body

    project.update({
        Name: name,
        NameIng: nameing,
        Text: text,
        TextIng: texting,
        DataProject: dataproject

    }, {
        where: {
            id: idProject
        }
    }).then(() => {
        return res.status(200).json({ message: "Succes" });
    }).catch(error => {
        res.status(500);
        res.json({ message: "Erro interno " + error });
    })
});

//Rota de edição da foto de um projeto ✓
router.post("/project/file/:id", [authToken, upload.single('file')], async (req, res) => {
    let idProject = req.params.id;

    let projeto = await project.findOne({ where: { id: idProject } });
    let pastaDoProjeto = __dirname;
    let caminhoFoto = path.join(pastaDoProjeto, '../../upload/' + projeto.ImgFile)

    if (projeto != undefined && projeto != null) {

        project.update({
            ImgFile: req.file.filename,
        },
            { where: { id: idProject, } })
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

//Rota de deleção de um projeto ✓
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

//Rota de Criação de experience ✓
router.post("/experience", [upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 },]), authToken], async (req, res) => {
    let { position, positionIng, text, textIng, } = req.body
    let { logo, file } = req.files

    experience.create({
        Position: position,
        PositionIng: positionIng,
        Text: text,
        TextIng: textIng,
        Logo: logo[0].filename,
        ImgFile: file[0].filename,

    }).then(() => {
        return res.status(200).json({ message: "Succes" });
    }).catch(error => {
        res.status(500);
        res.json({ message: "Erro interno " + error });
    })

});

//Rota de Edição de experience
router.post("/experience/:id", authToken, async (req, res) => {
    let { id } = req.params
    let { position, positionIng, text, textIng, } = req.body

    experience.update({
        Position: position,
        PositionIng: positionIng,
        Text: text,
        TextIng: textIng,

    }, { where: { id: id } })
        .then(() => {
            return res.status(200).json({ message: "Succes" });
        }).catch(error => {
            res.status(500);
            res.json({ message: "Erro interno " + error });
        })

});

//Rota de edição da foto de experience
router.post("/experience/file/:id", [upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 },]), authToken], async (req, res) => {
    let { id } = req.params
    let { position, positionIng, text, textIng, } = req.body
    let { logo, file } = req.files

    let expe = await experience.findOne({ where: { id: id } });
    let pastaDoProjeto = __dirname;

    try {

        if (logo) {
            let caminhoFotoLogo = path.join(pastaDoProjeto, '../../upload/' + expe.ImgFile)
            experience.update({
                ImgFile: logo[0].filename,
            },
                { where: { id: id, } })
                .then(() => {
                    fs.unlink(caminhoFotoLogo, (err) => {
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
        }

        if (file) {
            let caminhoFotoLogo = path.join(pastaDoProjeto, '../../upload/' + expe.ImgFile)
            experience.update({
                ImgFile: file[0].filename,
            },
            { where: { id: id, } })
            .then(() => {
                fs.unlink(caminhoFotoLogo, (err) => {
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
        }

    } catch (error) {
        res.status(500);
        res.json({ message: "Erro interno " + erro });
    }

});

//Rota de deleção de uma experience ✓
router.delete("/experience/:id", authToken, async (req, res) => {

    let id = req.params.id
    let expe = await experience.findOne({ where: { id: id } });
    let pastaDoProjeto = __dirname;
    let caminhoFoto = path.join(pastaDoProjeto, '../../upload/' + expe.ImgFile)
    let caminhoLogo = path.join(pastaDoProjeto, '../../upload/' + expe.Logo)

    if (expe != undefined && expe != null) {

        experience.destroy({ where: { id: id, } })
            .then(() => {
                fs.unlink(caminhoFoto, (err) => {
                    if (err) {
                        res.json({ message: err })
                    } else {
                        fs.unlink(caminhoLogo, (err) => {
                            if (err) {
                                res.json({ message: err })
                            } else {
                                return res.status(200).json({ message: "Succes" });
                            }
                        });
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