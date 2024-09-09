const jwt = require('jsonwebtoken');
const keys = require("../keys");
const JWTSecret = keys.JWTSecret

function authJWT(req, res, next) {
    const authToken = req.headers['authorization']

    let separar = authToken.split(' ')
    let token = separar[1]

    if (token != undefined) {
        
        jwt.verify(token, JWTSecret, (err, data) => {
            if (err) {
                res.status(401)
                res.json({ message: "Token Invalido! " + err });
            } else {
                next();
            }
        })

    } else {
        res.status(401)
        res.json({ message: "Token Invalido!" });
    }
}

module.exports = authJWT;