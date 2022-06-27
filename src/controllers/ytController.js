const { topSongParams, playerParams, searchParams } = require('../config/yt-music');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

        const response = await axios.post(
            "https://music.youtube.com/youtubei/v1/player", 
            {videoId: musicId, ...playerParams },
            {
                headers: {
                    // ":authority": "music.youtube.com",
                    // ":method": "POST",
                    // ":path": "/youtubei/v1/player?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&prettyPrint=false",
                    // ":scheme": "https",
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json",
                    "cookie": "YSC=3M-DzFuWG_8; VISITOR_INFO1_LIVE=30YR7aMf0LI",
                    "origin": "https://music.youtube.com",
                    "referer": "https://music.youtube.com/search?q=yofukashi+no+uta",
                    "sec-fetch-dest": "empty",
                    "Sec-Fetch-Mode": "navigate ",
                    "Sec-Fetch-Site": "cross-site",
                    "Upgrade-Insecure-Requests": "1",
                    "Connection": "keep-alive",
                    "Sec-Fetch-User": "?1",
                    "Sec-GPC": "1",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36",
                    "x-goog-visitor-id": "CgszMFlSN2FNZjBMSSjK5OiVBg%3D%3D",
                    "x-youtube-client-name": "67",
                    "x-youtube-client-version": "1.20220622.01.00"
                }
            }
            ).then(res => res.data)

        // return res.send({ config, data, headers, status, statusText })

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

        const hydrateSignature = reverseSignature.slice(0, reverseSignature.length - 3) // USAR FILTER

        const splitHydrateSignature = hydrateSignature.split("")

        const signatureEncoded = [...splitHydrateSignature]
        signatureEncoded[48] = splitHydrateSignature[0]
        signatureEncoded[0] = splitHydrateSignature[48]

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