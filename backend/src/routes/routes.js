const express = require('express');
const router = express.Router();

// Importa rotas de módulos
const playerRoutes = require('../players/playerRoutes');
const scoreRoutes = require('../scores/scoreRoutes');

// Rota base para teste
router.get('/', (req, res) => {
  res.send('API funcionando');
});

router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    console.log('Session encontrada:', req.session);
    return res.json({ loggedIn: true, user: req.session.user });
  } else {
    console.log('Session nao encontrada');
    return res.json({ loggedIn: false });
  }
});


// Rotas específicas (todas dentro de /api)
router.use('/players', playerRoutes);
router.use('/score', scoreRoutes);

module.exports = router;
