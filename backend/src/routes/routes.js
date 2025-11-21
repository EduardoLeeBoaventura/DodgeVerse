const express = require('express');
const router = express.Router();

// Importa rotas de módulos
const playerRoutes = require('../players/playerRoutes');
const scoreRoutes = require('../scores/scoreRoutes');

// Rota base para teste
router.get('/', (req, res) => {
  res.send('API funcionando');
});

// Rotas específicas (todas dentro de /api)
router.use('/players', playerRoutes);
router.use('/score', scoreRoutes);

module.exports = router;
