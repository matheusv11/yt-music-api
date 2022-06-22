const { verify } = require('jsonwebtoken');

module.exports = {
    userAccess(req, res, next) {
        const token = req.headers.authorization

        if(!token) return res.status(401).send({ message: 'Token não informado' });

        try {
            const { id } = verify(token.split(' ')[1], process.env.JWT_SECRET_USER || 'secret@123')
            res.locals.userId = id
            next()
        } catch(e) {
            return res.status(403).send({ message: "Token inválido"});
        }

    },

    userOptionalAccess(req, res, next) { // O REQUEST ACESS DÁ ERRO NO MIDDLEWARE, PRECISARIA DEFINIR UM CONTEXTO GLOBAL DO EXPRESS
        const token = req.headers.authorization

        if(!token) return next()
        
        try{
            const { id } = verify(token.split(' ')[1], process.env.JWT_SECRET_USER || 'secret@123') // NÃO RETORNA O ERR
            res.locals.userId = id
            next()
        }catch(e) {
            next()
        }

    },
}