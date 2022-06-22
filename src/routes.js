// CONTROLLERS
const ytController = require('./controllers/ytController');
const usuarioController = require('./controllers/usuarioController');
const playListController = require('./controllers/playListController');

module.exports = (app) => {

    app.get('/', (req, res) => res.send("PONG!!!"))

    app.get('/top-musicas', ytController.topMusics)

    app.get('/musica/:musicId', ytController.getMusic)

    app.post('/usuario', usuarioController.create)

    app.post('/playlist', playListController.create)

}