const { PrismaClient } = require('@prisma/client');
const { hashSync: hash} = require('bcrypt');
const prisma = new PrismaClient();

module.exports = {
    async get(req, res) {},
    
    async create(req, res, next) {
        const { nome, email, senha } = req.body; // USAR UM JOI PRA IMPEDIR QUEBRAR
        const usuario = await prisma.usuario.findFirst({
            where: {
                email
            }
        });

        if(usuario) return res.status(401).send({ error: 'Usúario já cadastrado' });
        
        const hashPassword = hash(senha, 10);

        await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashPassword
            }
        }).catch(err => next(err));

        return res.status(201).send({ message: 'Cadastro concluido com sucesso'});
    },

}