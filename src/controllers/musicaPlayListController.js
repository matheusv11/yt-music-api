const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = {
    async get(req, res) {},

    async create(req, res, next) {
        const { userId } = res.locals;
        const { nome, thumbnail, musicaId, playlistId } = req.body;

        const musicaPlaylist = await prisma.musica_playlist.findFirst({
            where: {
                musica_id: musicaId,
                playlist_id: parseInt(playlistId)
            }
        }); // Não precisa necessariamente validar o usúario ou se a playlist existe

        if(musicaPlaylist) return res.status(404).send({ error: "Música já existe na playlist" });

        const playlist = await prisma.playlist.findFirst({ // GARANTINDO QUE A PLAYLIST EXISTA E SEJA DO USUARIO AUTENTICADO
            where: {
                id: parseInt(playlistId),
                usuario_id: parseInt(userId),
            }
        });

        if(!playlist) return res.status(404).send({ error: "Playlist não encontrada" });

        await prisma.musica_playlist.create({
            data: {
                nome,
                thumbnail,
                musica_id: musicaId,
                playlist_id: parseInt(playlistId)
            }
        }).catch(err => next(err))

        return res.status(201).send({ message: 'Música adicionada na playlist'});
    },

}