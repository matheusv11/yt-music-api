// CONTROLLERS
const ytController = require('./controllers/ytController');
const usuarioController = require('./controllers/usuarioController');
const playListController = require('./controllers/playListController');
const musicaPlayListController = require('./controllers/musicaPlayListController');
const authController = require('./controllers/authController');

const fs = require('fs');
// MIDDLEWARES
const jwt = require('./middlewares/jwt');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter:(req,file,cb)=>{
        const filetype=['image/png','image/jpg','image/jpeg']

        if (filetype.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('arquivo nao suportado'))
        }
    }
})

module.exports = (app) => {

    app.get('/', (req, res) => res.send("PONG!!!"))

    app.get('/log', (req, res) => {
        const file = fs.readFileSync('log.txt')

        return res.send(JSON.parse(file))
    })

    app.get('/user-info', jwt.userAccess, usuarioController.userInfo)

    app.get('/top-musicas', ytController.topMusics)
    app.get('/musica/:musicId', ytController.getMusic)
    app.get('/search-music', ytController.searchMusic);

    app.post('/usuario', upload.single('profilePic'), usuarioController.create)
    
    app.get('/playlist/:playlistId', jwt.userAccess, playListController.getPlaylist)
    app.get('/all-playlists', jwt.userAccess, playListController.allPlaylists)
    
    app.post('/playlist', jwt.userAccess, playListController.create)
    app.delete('/playlist/:playlistId', jwt.userAccess, playListController.delete)

    app.post('/musica-playlist', jwt.userAccess, musicaPlayListController.create);

    app.post('/auth', authController.auth)

    app.get('/validate-token', jwt.userAccess, authController.token)

}