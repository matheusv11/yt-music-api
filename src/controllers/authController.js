const { PrismaClient } = require('@prisma/client');
const { sign: token } = require('jsonwebtoken');
const { compareSync: compareHash } = require('bcrypt');

const prisma = new PrismaClient();

module.exports = {
    async auth(req, res) {

        const { email, senha } = req.body
        
        const result = await prisma.usuario.findFirst({
            where: {
                email: email
            }
        });

        if(!result || !compareHash(senha, result.senha) ){
            return res.status(401).send({ error: 'Email ou senha incorretos' });
        }

        const acessToken= token({ id: result.id }, process.env.JWT_SECRET || 'secret@123', {
            expiresIn: '240min'
        });

        await prisma.$disconnect();
        
        return res.status(200).send({ acessToken });

    },

    async token(req, res) {
        return res.status(200).send({ message: " Token válido "})        
    }
}