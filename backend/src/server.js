const express = require('express');
const cors = require('cors');
const path = require('path');
const waitPort = require('wait-port');

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

  const baseRoutes = require('./routes/routes');
  const playerRoutes = require('./players/playerRoutes');
  // const scoreRoutes = require('./scores/scoreRoutes');

  app.use('/api', baseRoutes);
  app.use('/api/players', playerRoutes);
  // app.use('/api/score', scoreRoutes);

  const PORT = process.env.BACKEND_PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
};

// inicia
startServer();
