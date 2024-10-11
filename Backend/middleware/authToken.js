const jwt = require('jsonwebtoken');
const keys = require("../keys");
const JWTSecret = keys.JWTSecret

function authJWT(req, res, next) {
    const authToken = req.headers['authorization']

    if(authToken != undefined){
        let separar = authToken.split(' ')
        let token = separar[1]
        if (token != undefined) {
            
            jwt.verify(token, JWTSecret, (err, data) => {
                if (err) {
                    res.status(401)
                    res.json({ message: "Token Inválido! " + err });
                } else {
                    next();
                }
            })

        } else {
            res.status(401)
            res.json({ message: "Token Inválido!" });
        }
    }else{
        return res.status(404).json({message: "Token Inválido!"})
    }
}

module.exports = authJWT;