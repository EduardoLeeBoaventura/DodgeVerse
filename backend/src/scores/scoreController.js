const Score = require('./scoreModels');


exports.auxiliaryCreateScore = async (playerId, score) => {
    const newScore = await Score.create(playerId, score);
    return newScore;
}
exports.createScore = async (req, res) => {
    try {
        const { playerId } = req.body;
        const newScore = await Score.create(playerId, score);
        return res.status(201).json({ message: 'Score criado com sucesso!', score: newScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar score.' });
    }
};

exports.verifyScore = async (req, res) => {
    try {
        const { playerId } = req.body;
        const score = await Score.findByPlayerId(playerId);
        if (!score) return res.status(404).json({ message: 'Score nao encontrado.' });
        return res.status(200).json({ message: 'Score encontrado com sucesso!', score: score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar score.' });
    }
};

exports.updateScore = async (req, res) => {
    try {
        const { userId, score } = req.body;
        const updatedScore = await Score.update(userId, score);
        return res.status(200).json({ message: 'Score atualizado com sucesso!', score: updatedScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar score.' });
    }
};

exports.showTopScores = async (req, res) => {
    try {
        const topScores = await Score.getTopScores();
        return res.status(200).json({ message: 'Top scores encontrados com sucesso!', scores: topScores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar top scores.' });
    }
};