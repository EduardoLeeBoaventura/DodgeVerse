const express = require('express');
const cors = require('cors');
const waitPort = require('wait-port');
const session = require('express-session');

require('./database');

const startServer = async () => {
  const portOpen = await waitPort({
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    timeout: 30000
  });

  if (!portOpen) {
    console.error('Postgres não abriu a porta a tempo.');
    process.exit(1);
  }

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use(session({
    secret: 'game1win2dodger32025',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    }
  }));

  const routes = require('./routes/routes');

  app.use('/api', routes);

  const PORT = process.env.BACKEND_PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
};

startServer();
