const express = require('express');
const app = express();
const port = process.env.NODE_PORT || 3030;

// Usar estrutura top level do feathers?
// app.use(routes);

const routes = require('./routes')(app); // SEM .use pois já é executado? // TALVEZ TENHA COMO MELHORAR

app.listen(port, () => {
    console.log(`Api Running in Port: ${port}`)
})