// const 
const axios = require('axios');

module.exports = (app) => {

    app.get('/', (req,res) => {
        res.send("PONG!!!")
    })

    app.get('/top-musics', async (req, res, next) => {
        const response = await axios.post('https://music.youtube.com/youtubei/v1/browse', {
            "context": {
              "client": {
                "hl": "en",
                "gl": "BR",
                "remoteHost": "45.226.60.40",
                "deviceMake": "",
                "deviceModel": "",
                "visitorData": "CgtJRnFfbUE3bzNvayjCh--UBg%3D%3D",
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36,gzip(gfe)",
                "clientName": "WEB_REMIX",
                "clientVersion": "1.20220518.01.00",
                "osName": "Windows",
                "osVersion": "10.0",
                "originalUrl": "https://music.youtube.com/",
                "platform": "DESKTOP",
                "clientFormFactor": "UNKNOWN_FORM_FACTOR",
                "configInfo": {
                  "appInstallData": "CMKH75QGEJiHrgUQ_bj9EhCY3v0SEJSPrgUQ1IOuBRC3y60FELiLrgUQgo6uBRCiwP0SENi-rQU%3D"
                },
                "browserName": "Chrome",
                "browserVersion": "102.0.5005.61",
                "screenWidthPoints": 1920,
                "screenHeightPoints": 479,
                "screenPixelDensity": 1,
                "screenDensityFloat": 1,
                "utcOffsetMinutes": -180,
                "userInterfaceTheme": "USER_INTERFACE_THEME_DARK",
                "timeZone": "America/Sao_Paulo",
                "musicAppInfo": {
                  "pwaInstallabilityStatus": "PWA_INSTALLABILITY_STATUS_UNKNOWN",
                  "webDisplayMode": "WEB_DISPLAY_MODE_BROWSER",
                  "storeDigitalGoodsApiSupportStatus": {
                    "playStoreDigitalGoodsApiSupportStatus": "DIGITAL_GOODS_API_SUPPORT_STATUS_UNSUPPORTED"
                  },
                  "musicActivityMasterSwitch": "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
                  "musicLocationMasterSwitch": "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE"
                }
              },
              "user": {
                "lockedSafetyMode": false
              },
              "request": {
                "useSsl": true,
                "internalExperimentFlags": [],
                "consistencyTokenJars": []
              },
              "adSignalsInfo": {
                "params": [
                  {
                    "key": "dt",
                    "value": "1654375371618"
                  },
                  {
                    "key": "flash",
                    "value": "0"
                  },
                  {
                    "key": "frm",
                    "value": "0"
                  },
                  {
                    "key": "u_tz",
                    "value": "-180"
                  },
                  {
                    "key": "u_his",
                    "value": "10"
                  },
                  {
                    "key": "u_h",
                    "value": "1080"
                  },
                  {
                    "key": "u_w",
                    "value": "1920"
                  },
                  {
                    "key": "u_ah",
                    "value": "1040"
                  },
                  {
                    "key": "u_aw",
                    "value": "1920"
                  },
                  {
                    "key": "u_cd",
                    "value": "24"
                  },
                  {
                    "key": "bc",
                    "value": "31"
                  },
                  {
                    "key": "bih",
                    "value": "479"
                  },
                  {
                    "key": "biw",
                    "value": "1908"
                  },
                  {
                    "key": "brdim",
                    "value": "0,0,0,0,1920,0,1920,1040,1920,479"
                  },
                  {
                    "key": "vis",
                    "value": "1"
                  },
                  {
                    "key": "wgl",
                    "value": "true"
                  },
                  {
                    "key": "ca_type",
                    "value": "image"
                  }
                ]
              }
            }
        })
        .then(result => result.data)
        .catch(err => next(err))

        const top = response.contents.singleColumnBrowseResultsRenderer.tabs[0]
                    .tabRenderer.content.sectionListRenderer.contents[0]
                    .musicCarouselShelfRenderer.contents
                    .map(({ musicResponsiveListItemRenderer: msc }) => {
                        return {
                            name: msc.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
                            musicId: msc.playlistItemData.videoId,
                            thumbnail: msc.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url
                        }
                    })

        return res.status(200).json(top)
    })

}