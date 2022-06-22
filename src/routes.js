// CONTROLLERS
const ytController = require('./controllers/ytController');
const usuarioController = require('./controllers/usuarioController');
const playListController = require('./controllers/playListController');
const authController = require('./controllers/authController');

// MIDDLEWARES
const jwt = require('./middlewares/jwt');

module.exports = (app) => {

    app.get('/', (req, res) => res.send("PONG!!!"))

    app.get('/top-musicas', ytController.topMusics)

    app.get('/musica/:musicId', ytController.getMusic)

    app.post('/usuario', usuarioController.create)

    app.post('/playlist', jwt.userAccess, playListController.create)

    app.post('/auth', authController.auth)

}