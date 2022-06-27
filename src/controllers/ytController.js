const { topSongParams, playerParams, searchParams } = require('../config/yt-music');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch')

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

        axios.default.defaults.headers.common['CLIENT_IP'] = "45.226.60.40"

        const fetchData = await fetch("https://music.youtube.com/youtubei/v1/player?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&prettyPrint=false", {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-goog-visitor-id": "CgszMFlSN2FNZjBMSSjK5OiVBg%3D%3D",
              "x-youtube-client-name": "67",
              "x-youtube-client-version": "1.20220622.01.00",
              "cookie": "YSC=3M-DzFuWG_8; VISITOR_INFO1_LIVE=30YR7aMf0LI",
              "Referer": "https://music.youtube.com/search?q=yofukashi+no+uta",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"videoId\":\"zArhnXbh3Yc\",\"context\":{\"client\":{\"hl\":\"en\",\"gl\":\"BR\",\"remoteHost\":\"45.226.62.173\",\"deviceMake\":\"\",\"deviceModel\":\"\",\"visitorData\":\"CgszMFlSN2FNZjBMSSjK5OiVBg%3D%3D\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36,gzip(gfe)\",\"clientName\":\"WEB_REMIX\",\"clientVersion\":\"1.20220622.01.00\",\"osName\":\"Windows\",\"osVersion\":\"10.0\",\"originalUrl\":\"https://music.youtube.com/\",\"platform\":\"DESKTOP\",\"clientFormFactor\":\"UNKNOWN_FORM_FACTOR\",\"configInfo\":{\"appInstallData\":\"CMrk6JUGEJje_RIQuIuuBRC3y60FEP24_RIQ1IOuBRCUj64FENi-rQU%3D\"},\"browserName\":\"Chrome\",\"browserVersion\":\"103.0.5060.53\",\"screenWidthPoints\":1920,\"screenHeightPoints\":429,\"screenPixelDensity\":1,\"screenDensityFloat\":1,\"utcOffsetMinutes\":-180,\"userInterfaceTheme\":\"USER_INTERFACE_THEME_DARK\",\"timeZone\":\"America/Sao_Paulo\",\"playerType\":\"UNIPLAYER\",\"tvAppInfo\":{\"livingRoomAppMode\":\"LIVING_ROOM_APP_MODE_UNSPECIFIED\"},\"clientScreen\":\"WATCH_FULL_SCREEN\"},\"user\":{\"lockedSafetyMode\":false},\"request\":{\"useSsl\":true,\"internalExperimentFlags\":[],\"consistencyTokenJars\":[]},\"clientScreenNonce\":\"MC4yMDg1MzE4MTg1MjYzOTYyNA..\",\"adSignalsInfo\":{\"params\":[{\"key\":\"dt\",\"value\":\"1656369781865\"},{\"key\":\"flash\",\"value\":\"0\"},{\"key\":\"frm\",\"value\":\"0\"},{\"key\":\"u_tz\",\"value\":\"-180\"},{\"key\":\"u_his\",\"value\":\"3\"},{\"key\":\"u_h\",\"value\":\"1080\"},{\"key\":\"u_w\",\"value\":\"1920\"},{\"key\":\"u_ah\",\"value\":\"1040\"},{\"key\":\"u_aw\",\"value\":\"1920\"},{\"key\":\"u_cd\",\"value\":\"24\"},{\"key\":\"bc\",\"value\":\"31\"},{\"key\":\"bih\",\"value\":\"429\"},{\"key\":\"biw\",\"value\":\"1908\"},{\"key\":\"brdim\",\"value\":\"0,0,0,0,1920,0,1920,1040,1920,429\"},{\"key\":\"vis\",\"value\":\"1\"},{\"key\":\"wgl\",\"value\":\"true\"},{\"key\":\"ca_type\",\"value\":\"image\"}]},\"clickTracking\":{\"clickTrackingParams\":\"CMwBEMjeAiITCK2avJPazvgCFXtRSAAdJw0PvQ==\"}},\"playbackContext\":{\"contentPlaybackContext\":{\"html5Preference\":\"HTML5_PREF_WANTS\",\"lactMilliseconds\":\"18\",\"referer\":\"https://music.youtube.com/search?q=yofukashi+no+uta\",\"signatureTimestamp\":19167,\"autoCaptionsDefaultOn\":false,\"mdxContext\":{}}},\"cpn\":\"86uBKTw7xzmV5q2F\",\"playlistId\":\"RDAMVMzArhnXbh3Yc\",\"captionParams\":{},\"serviceIntegrityDimensions\":{\"poToken\":\"GpsBCm5w1P3UjTXxkJ7T49UL-wTC4fs7n6Y7VNQamQgluBdz4EJtwC8fNeVt2boTHFelL6r7nYXHmTaKWCCaNTk28Vw7BcPqbAiiOiF56S1sFTB9LwC2HbfAJGU_o-4kpG8D1PBwTtDs9WFlXPr1AuAsxhIpATwYQQ63J4M-seUdg473Ldrwgdck5c7s8g1lG8BWWTqnOhS6CvrTMGs=\"}}",
            "method": "POST"
          });
        
        const retorno = await fetchData.json()

        return res.send(retorno)
        // const response = await fetchData.json()

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