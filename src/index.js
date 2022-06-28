const express = require('express');
const app = express();
const port = process.env.PORT || process.env.NODE_PORT || 3030;

// ROTAS
app.use(express.json())
require('./routes')(app);

app.listen(port, () => {
    console.log(`Api Running in Port: ${port}`)
})