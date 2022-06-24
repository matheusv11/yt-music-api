const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = {
    async get(req, res) {},

    async getPlaylist(req, res) {
        const { playlistId } = req.params;
        const { userId } = res.locals;

        const playlist = await prisma.playlist.findFirst({
            where: {
                id: parseInt(playlistId),
                usuario_id: parseInt(userId),
            },
            include: {
                musica_playlist: true
            }
        });

        if(!playlist) return res.status(404).send({ error: "Playlist não encontrada" });

        return res.status(200).send(playlist);
    },
    
    async allPlaylists(req, res) {
        const { userId } = res.locals;

        const playlists = await prisma.playlist.findMany({
            where: {
                usuario_id: parseInt(userId)
            },
            include: {
                musica_playlist: true
            }
        });

        return res.status(200).send(playlists);
    },

    async create(req, res, next) {
        const { userId } = res.locals;
        const { nome } = req.body;

        const playlist = await prisma.playlist.create({
            data: {
                nome,
                usuario_id: parseInt(userId)
            },
            include: {
                musica_playlist: true
            }
        }).catch(err => next(err))

        return res.status(201).send({ message: 'Playlist criada com sucesso', created: playlist });
    },

    async delete(req, res, next){
        const { userId } = res.locals;
        const {playlistId } = req.params;

        const playlist = await prisma.playlist.findFirst({
            where: {
                id: parseInt(playlistId),
                usuario_id: parseInt(userId),
            },
            include: {
                musica_playlist: true
            }
        });

        if(!playlist) return res.status(404).send({ error: "Playlist não encontrada" });

        await prisma.playlist.delete({
            where: {
                id: parseInt(playlistId)
            }
        }).catch(err => next(err));

        return res.status(200).send({ message: "Playlist deletada com sucesso" });

    }

}