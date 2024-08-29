const jwt = require('jsonwebtoken');
const key = require("../Keys");
const JWTSecret = key.JWTSecret

function authJWT(req, res, next) {
    const authToken = req.body.token
    if (authToken != undefined) {

        jwt.verify(authToken, JWTSecret, (err, data) => {
            if (err) {
                res.status(500)
                res.json({ message: "Erro interno" });
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