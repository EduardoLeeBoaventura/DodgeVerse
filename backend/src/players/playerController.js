const bcrypt = require('bcrypt');
const Player = require('./playerModels');
const Score = require('../scores/scoreController');

exports.createPlayer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Player.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Usuário já cadastrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPlayer = await Player.create(name, email, hashedPassword);

    let newScore;
    
    try{
      newScore = await Score.createScore(newPlayer.id, 0);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar score inicial para o jogador.'});
    }

    return res.status(201).json({ message: 'Jogador adastrado com sucesso!', player: newPlayer, score: newScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar jogador.' });
    console.error('ERRO DETALHADO:', error);
  }
};

exports.logoutPlayer = (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logout realizado com sucesso!' });
}

exports.loginPlayer = async (req, res) => {
  try {
    console.log('Login:', req.body)
    if(req.session.playerId) return res.status(400).json({ message: 'Jogador ja logado.' });

    const { email, password } = req.body;

    const player = await Player.findByEmail(email);
    if (!player) return res.status(404).json({ message: 'Jogador não encontrado.' });

    const isValid = await bcrypt.compare(password, player.password);
    if (!isValid) return res.status(401).json({ message: 'Senha incorreta.' });

    req.session.playerId = player.id;
    req.session.email = player.email;

    return res.status(200).json({ message: 'Login realizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};


