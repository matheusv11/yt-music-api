const { topSongParams, playerParams, searchParams } = require('../config/yt-music');
const axios = require('axios');

module.exports = {
    async topMusics(req, res, next) {
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
    },

    async getMusic(req, res, next) {
        const { musicId } = req.params // VALIDAR SE O PARAMS NÃO VAI QUEBRAR COM ALGUM ID

        const response = await axios.post("https://music.youtube.com/youtubei/v1/player", {videoId: musicId, ...playerParams })
        .then(result => result.data)
        .catch(err => next(err))

        // VALIDAR SE SEMPRE EXISTE O AUDIO
        const {signatureCipher: encodedLink, url: urlVideo} = response.streamingData.adaptiveFormats
        .find(e=>e.itag === 251)

        if(urlVideo) {
            return res.status(200).json({ 
                url: urlVideo
            })
        }

        // ENCODED
        const encodedSignature = encodedLink.split("&")[0].replace("s=", "")
        const encodedUrl = encodedLink.split("&")[2].replace("url=", "")

        // SIGNATURE DECODE
        const reverseSignature = decodeURIComponent(encodedSignature)
                                 .split("").reverse().join("")

        const splitHydrateSignature = reverseSignature.split("")

        const signatureEncoded = [...splitHydrateSignature]
        signatureEncoded[0] = splitHydrateSignature[34]
        signatureEncoded[34] = splitHydrateSignature[52]
        signatureEncoded[52] = splitHydrateSignature[0]

        //DECODED
        const decodedUrl = decodeURIComponent(encodedUrl)
        const decodedSignature = signatureEncoded.join("")

        const musicLink = `${decodedUrl}&sig=${decodedSignature}`

        return res.status(200).json({
            nome: response.videoDetails.title,
            thumbnail: response.videoDetails.thumbnail.thumbnails[0].url,
            url: musicLink
        })

    },

    async searchMusic(req, res, next) {
        const { musica } = req.query;
        const response = await axios.post("https://music.youtube.com/youtubei/v1/search", { query: musica, ...searchParams })
        .then(result => result.data)
        .catch(err => next(err))

        const filterMusic = ['Songs', 'Videos'];

        const musicList = response.contents.tabbedSearchResultsRenderer.tabs[0]
        .tabRenderer.content.sectionListRenderer.contents
        .filter(m => filterMusic.includes(m.musicShelfRenderer.title.runs[0].text) )
        .reduce((initial, list) => {
            const musicData =  list.musicShelfRenderer.contents.map(({ musicResponsiveListItemRenderer: msc }) => {
                return {
                    name: msc.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
                    musicId: msc.playlistItemData.videoId,
                    thumbnail: msc.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url
                }
            })

            initial.push(...musicData)
            return initial;
        }, []);

        return res.status(200).send(musicList)
    }
}