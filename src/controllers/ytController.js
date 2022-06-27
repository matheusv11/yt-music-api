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

        const response = await axios.post("https://music.youtube.com/youtubei/v1/player", {videoId: musicId, ...playerParams }, {
            headers: {
                // ":authority": "music.youtube.com",
                // ":method": "POST",
                // ":path": "/youtubei/v1/player?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&prettyPrint=false",
                // ":scheme": "https",
                // "accept": "*/*",
                // "accept-language": "en-US,en;q=0.9",
                // "authorization": "SAPISIDHASH 1656304879_ba1c48a16f3e33b95f3b5cbf50986941b23f00cb",
                // "content-type": "application/json",
                // "cookie": "YSC=7or6Il71zPo; VISITOR_INFO1_LIVE=LgHOrY4B5Zs; SID=LgjaXe5u52t-FvExAt9x2fHTttjO22UvzXiJlzbq7oCzD9nCDItofgmV_LVOtkJmIGJPkA.; __Secure-1PSID=LgjaXe5u52t-FvExAt9x2fHTttjO22UvzXiJlzbq7oCzD9nCtVvAEd2SgzudsG8Ca6_s7g.; __Secure-3PSID=LgjaXe5u52t-FvExAt9x2fHTttjO22UvzXiJlzbq7oCzD9nCrDkQEszs8zioywsMMa-7ZA.; HSID=ANbyAObFqb2MBhHaG; SSID=ANXJlLX9OUgtKcr7i; APISID=6sfwnpCLTeRSg9Mh/AuImiYpMrD7rHCVKP; SAPISID=-__CpdbKRiktDb-i/AuafPvIBc0tyh5KSY; __Secure-1PAPISID=-__CpdbKRiktDb-i/AuafPvIBc0tyh5KSY; __Secure-3PAPISID=-__CpdbKRiktDb-i/AuafPvIBc0tyh5KSY; LOGIN_INFO=AFmmF2swRQIgCvsWmxa-hdwc5dLzvQxjBvae625IQOYesl3FfmBNMRMCIQDANkv3xqQ5iAOFxVgS1EII9VUAOdd4seb1YZvUna_SMQ:QUQ3MjNmemE2ZEJyQ2hZNVBmR0ZwdzdPbFNtbFRyMjVlcTkydVRMeHd1QVh2cVYtOXZkbERUbmYxMmFna2pLU3R6S2pkX0pzd1o2ZUFrbzlZZnc2cGF0b2FlOGRXZXd5WWR0b1VBV1dDYjJJeWxoUWVLOUJwaUxEZ29rZjdxSW9rWnVTOEdQdFhRZTcxdDl3WlZvb2YwVUtXZzBqMlJqdkVWSFFGOVFuY0w0Ql9NcllNSHpmTlU1TndHdlprNXd4akNsZkJPMXRRSV90V0F1SkxibTdqY2RUcE4zME9GVEMxUQ==; PREF=tz=America.Fortaleza; SIDCC=AJi4QfHSHmVV-a40gTkwRZ1uAMVyIOfuFOSzvOHBGbgaCLFA0-tS_oDYeR5tfzpfo4Dn-OT3BK0; __Secure-1PSIDCC=AJi4QfF0igAZpoOI6kO0_4d246sJrDyS532E7sFPmS8C7aE4N5qGvH7iB66e6fyXodptcDfD088; __Secure-3PSIDCC=AJi4QfEob6fSvCTjgrMJEuL9vvRX3dpFUAaRLr2hQXoe8A-zPN-iijbTVgPU2FOeckgVX4fSGdk",
                // "origin": "https://music.youtube.com",
                // "referer": "https://music.youtube.com/",
                // "sec-fetch-dest": "empty",
                // "sec-fetch-mode": "cors",
                // "sec-fetch-site": "same-origin",
                // "sec-gpc": 1,
                // "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36",
                // "x-goog-authuser": "0",
                // "x-goog-pageid": "115713646410759597927",
                // "x-goog-visitor-id": "CgtMZ0hPclk0QjVacyjm6eSVBg%3D%3D",
                // "x-origin": "https://music.youtube.com",
                // "x-youtube-client-name": "67",
                // "x-youtube-client-version": "1.20220613.01.00"
            }
        })
        .then(result => {
            return result.data
        })
        .catch(err => res.send(err))

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