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

//Rota para pegar Tabelas
router.get("/", async (req, res) => {
    try {
        let projects = await project.findAll();
        let home = await homeBase.findAll();
        let experiences = await experience.findAll();
        res.json({ projects, home, experiences });
        return res.status(200)
    } catch (error) {
        return res.status(500).json({ message: "Erro Interno" + error });
    }
});

//Pegar o token para edição
router.post("/login", async (req, res) => {
    let { password } = req.body

    //Valida se a senha não veio undefined
    if (password != undefined) {
        //valida se a senha é igual a registrada 
        if (password === keys.userADM) {
            //retorna o token se estiver tudo certo
            try {
                var token = jwt.sign({}, keys.JWTSecret, { expiresIn: '1h' });
                return res.status(201).json({ token: token });
            } catch (error) {
                return res.status(500).json({ message: "Erro interno " + error });
            }
        } else {
            return res.status(401).json({ message: "Senha inválida" });
        }
    } else {
        return res.status(401).json({ message: "Senha inválida" });
    }
});

//Rota de update da tabela Home
router.patch("/home/edit", authToken, async (req, res) => {
    let { textone, textoneing, texttwo, texttwoing } = req.body

    if (textone != undefined) {
        homeBase.update({
            TextOne: textone,
            TextOneIng: textoneing,
            TextTwo: texttwo,
            TextTwoIng: texttwoing,

        }, { where: {} }).then(() => {
            return res.status(200).json({ message: "Succes" });
        }).catch(error => {
            return res.status(500).json({ message: "Erro interno " + error });
        })
    } else {
        return res.status(500).json({ message: "Dados Inválidos " });
    }

});

//Rota de update da foto principal
router.patch("/home/file", [authToken, upload.single('fileHome')], async (req, res) => {

    let home = await homeBase.findOne({ where: {} });
    let caminhoFoto = path.join(__dirname, '../../upload/' + home.ImgFile)

    homeBase.update({
        ImgFile: req.file.filename,
    }, { where: {} })
        .then(() => {
            fs.unlink(caminhoFoto, (err) => {
                if (err) {
                    res.json({ message: err })
                } else {
                    return res.status(200).json({ message: "Succes" });
                }
            });
        }).catch(error => {
            return res.status(500).json({ message: "Erro interno " + error });
        })

});

//Rota de criação de um projeto 
router.post("/project", [authToken, upload.single('fileProject')], async (req, res) => {
    let { name, nameing, text, texting, dataproject } = req.body
    let file = req.file
    let caminhoNovaFoto = path.join(__dirname, '../../upload/' + req.file.filename)

    project.create({
        Name: name,
        NameIng: nameing,
        Text: text,
        TextIng: texting,
        ImgFile: file.filename,
        DataProject: dataproject

    }).then(() => {
        return res.status(201).json({ message: "Created" });
    }).catch(error => {
        fs.unlink(caminhoNovaFoto, (err) => {
            if (err) { console.error('Erro ao excluir o arquivo:', err) }
        });
        return res.status(500).json({ message: "Erro interno " + error });
    })

});

//Rota de edição de um projeto
router.patch("/project/:id", authToken, async (req, res) => {
    let idProject = req.params.id;
    let { name, nameing, text, texting, dataproject } = req.body

    let projectValid = await project.findOne({ where: { id: idProject } })

    if (projectValid != undefined) {
        project.update({
            Name: name,
            NameIng: nameing,
            Text: text,
            TextIng: texting,
            DataProject: dataproject
        }, { where: { id: idProject } })
            .then(() => {
                return res.status(200).json({ message: "Succes" });
            }).catch(error => {
                return res.status(500).json({ message: "Erro interno " + error });
            })
    } else {
        return res.status(404).json({ message: " Projeto não encontrado " });
    }
});

//Rota de edição da foto de um projeto
router.patch("/project/file/:id", [authToken, upload.single('fileProject')], async (req, res) => {
    let idProject = req.params.id;

    let projeto = await project.findOne({ where: { id: idProject } });
    let caminhoNovaFoto = path.join(__dirname, '../../upload/' + req.file.filename)

    if (projeto != undefined) {
        let caminhoFoto = path.join(__dirname, '../../upload/' + projeto.ImgFile)

        project.update({
            ImgFile: req.file.filename,
        }, { where: { id: idProject, } })
            .then(() => {
                fs.unlink(caminhoFoto, (err) => {
                    if (err) {
                        res.json({ message: err })
                    } else {
                        return res.status(200).json({ message: "Succes" });
                    }
                });
            })
            .catch(error => {
                fs.unlink(caminhoNovaFoto, (err) => {
                    if (err) { console.error('Erro ao excluir o arquivo:', err) }
                });
                return res.status(500).json({ message: "Erro interno " + error });
            })

    } else {
        fs.unlink(caminhoNovaFoto, (err) => {
            if (err) { console.error('Erro ao excluir o arquivo:', err) }
        });
        return res.status(404).json({ message: "Projeto não encontrado " });
    }

});

//Rota de delete de um projeto
router.delete("/project/:id", authToken, async (req, res) => {
    let id = req.params.id
    let projeto = await project.findOne({ where: { id: id } });

    if (projeto != undefined && projeto != null) {
        let caminhoFoto = path.join(__dirname, '../../upload/' + projeto.ImgFile);

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
            .catch(error => {
                return res.status(500).json({ message: "Dados Inválidos " + error });
            })

    } else {
        return res.status(404).json({ message: "Projeto não encontrado" });
    }

});

//Rota de Criação de experience
router.post("/experience", [upload.fields([{ name: 'logoExperience', maxCount: 1 }, { name: 'fileExperience', maxCount: 1 },]), authToken], async (req, res) => {
    let { position, positionIng, text, textIng, } = req.body
    let { logoExperience, fileExperience } = req.files

    experience.create({
        Position: position,
        PositionIng: positionIng,
        Text: text,
        TextIng: textIng,
        Logo: logoExperience[0].filename,
        ImgFile: fileExperience[0].filename,

    }).then(() => {
        return res.status(201).json({ message: "Created" });
    }).catch(error => {
        return res.status(500).json({ message: "Erro interno " + error });
    })

});

//Rota de Edição de experience
router.patch("/experience/:id", authToken, async (req, res) => {
    let { id } = req.params
    let { position, positionIng, text, textIng, } = req.body

    let experienceValid = await experience.findOne({ where: { id: id } })

    if (experienceValid != undefined) {
        experience.update({
            Position: position,
            PositionIng: positionIng,
            Text: text,
            TextIng: textIng,

        }, { where: { id: id } })
            .then(() => {
                return res.status(200).json({ message: "Succes" });
            }).catch(error => {
                return res.status(500).json({ message: "Erro interno " + error });
            })
    } else {
        return res.status(404).json({ message: "Experience não encontrada" });
    }
});

//Rota de edição da foto de experience
router.patch("/experience/file/:id", [upload.fields([{ name: 'logoExperience', maxCount: 1 }, { name: 'fileExperience', maxCount: 1 },]), authToken], async (req, res) => {
    let { id } = req.params
    let { logoExperience, fileExperience } = req.files

    let experienceValid = await experience.findOne({ where: { id: id } });

    try {

        if (experienceValid != undefined) {
            if (logoExperience) {
                let caminhoFotoLogo = path.join(__dirname, '../../upload/' + experienceValid.Logo)
                experience.update({
                    Logo: logoExperience[0].filename,
                },{ where: { id: id, } })
                .then(() => {
                    fs.unlink(caminhoFotoLogo, (err) => {
                        if (err) {
                            res.json({ message: err })
                        }
                    });
                })
                .catch(error => {
                    return res.status(500).json({ message: "Erro interno " + error });
                })
            }

            if (fileExperience) {
                let caminhoFotoFile = path.join(__dirname, '../../upload/' + experienceValid.ImgFile)
                experience.update({
                    ImgFile: fileExperience[0].filename,
                },{ where: { id: id}})
                .then(() => {
                    fs.unlink(caminhoFotoFile, (err) => {
                        if (err) {
                            res.json({ message: err })
                        }
                    });
                })
                .catch(error => {
                    return res.status(500).json({ message: "Erro interno " + error });
                })
            }

            return res.status(200).json({ message: "Succes" });
        } else {
            if(logoExperience){
                let caminhoNovaFotoLogo = path.join(__dirname, '../../upload/' + logoExperience[0].filename)
                fs.unlink(caminhoNovaFotoLogo, (err) => {
                    if (err) { console.error('Erro ao excluir o arquivo:', err) }
                });
            }
            if(fileExperience){
                let caminhoNovaFotoFile = path.join(__dirname, '../../upload/' + fileExperience[0].filename)
                fs.unlink(caminhoNovaFotoFile, (err) => {
                    if (err) { console.error('Erro ao excluir o arquivo:', err) }
                });
            }
            return res.status(404).json({ message: "Experiencia não encontrada" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erro interno " + error });
    }
});

//Rota de deleção de uma experience
router.delete("/experience/:id", authToken, async (req, res) => {
    let id = req.params.id
    let experienceValid = await experience.findOne({ where: { id: id }});

    if (experienceValid != undefined) {
        let caminhoFoto = path.join(__dirname, '../../upload/' + experienceValid.ImgFile)
        let caminhoLogo = path.join(__dirname, '../../upload/' + experienceValid.Logo)

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
        .catch(error => {
            return res.status(500).json({ message: "Erro interno " + error });
        })

    } else {
        return res.status(404).json({ message: "Projeto não encontrado" });
    }
});

module.exports = router;