const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use(session({
    secret: "uma_chave_muito_secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
}));

// Servir arquivos estáticos (HTML, CSS, JS)
app.use('/templates', express.static(path.join(__dirname, '../templates')));

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
