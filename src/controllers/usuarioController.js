const { PrismaClient } = require('@prisma/client');
const { hashSync: hash} = require('bcrypt');
const prisma = new PrismaClient();

module.exports = {
    async get(req, res) {},
    
    async userInfo(req, res) {
        const { userId } = res.locals;
        
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: parseInt(userId)
            }
        });

        return res.status(200).send(usuario);
    },
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
                senha: hashPassword,
                imagem: req.file.buffer
            }
        }).catch(err => next(err));

        return res.status(201).send({ message: 'Cadastro concluido com sucesso'});
    },

}