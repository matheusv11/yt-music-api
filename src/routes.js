// CONTROLLERS
const ytController = require('./controllers/ytController');
const usuarioController = require('./controllers/usuarioController');
const playListController = require('./controllers/playListController');
const musicaPlayListController = require('./controllers/musicaPlayListController');
const authController = require('./controllers/authController');

// MIDDLEWARES
const jwt = require('./middlewares/jwt');

module.exports = (app) => {

    app.get('/', (req, res) => res.send("PONG!!!"))

    app.get('/user-info', jwt.userAccess, usuarioController.userInfo)

    app.get('/top-musicas', ytController.topMusics)

    app.get('/musica/:musicId', ytController.getMusic)

    app.get('/search-music', ytController.searchMusic);

    app.post('/usuario', usuarioController.create)
    
    app.get('/playlist/:playlistId', jwt.userAccess, playListController.getPlaylist)
    app.get('/all-playlists', jwt.userAccess, playListController.allPlaylists)
    
    app.post('/playlist', jwt.userAccess, playListController.create)
    app.delete('/playlist/:playlistId', jwt.userAccess, playListController.delete)

    app.post('/musica-playlist', jwt.userAccess, musicaPlayListController.create);

    app.post('/auth', authController.auth)

    app.get('/validate-token', jwt.userAccess, authController.token)

}