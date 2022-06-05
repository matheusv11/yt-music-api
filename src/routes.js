// const 
const axios = require('axios');

const { topSongParams, playerParams } = require('./config/yt-music');

module.exports = (app) => {

    app.get('/', (req,res) => {
        res.send("PONG!!!")
    })

    app.get('/top-musics', async (req, res, next) => {
        const response = await axios.post('https://music.youtube.com/youtubei/v1/browse', topSongParams)
        .then(result => result.data)
        .catch(err => next(err))

        const topSongs = response.contents.singleColumnBrowseResultsRenderer.tabs[0]
                    .tabRenderer.content.sectionListRenderer.contents[0]
                    .musicCarouselShelfRenderer.contents
                    .map(({ musicResponsiveListItemRenderer: msc }) => {
                        return {
                            name: msc.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
                            musicId: msc.playlistItemData.videoId,
                            thumbnail: msc.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url
                        }
                    })

        return res.status(200).json(topSongs)
    })

    app.get('/music/:musicId', async (req, res, next) => {
        const { musicId } = req.params // VALIDAR SE O PARAMS NÃO VAI QUEBRAR COM ALGUM ID

        const response = await axios.post("https://music.youtube.com/youtubei/v1/player", {videoId: musicId, ...playerParams })
        .then(result => result.data)
        .catch(err => next(err))

        // VALIDAR SE SEMPRE EXISTE O AUDIO
        const musicLink = response.streamingData.adaptiveFormats
        .find(e=> {
            console.log("Elementos", e)
            return e.mimeType.includes("audio/webm")
        })
        .signatureCipher
        .split('&url=')[1]

        return res.status(200).json({ url: musicLink })

    })

}