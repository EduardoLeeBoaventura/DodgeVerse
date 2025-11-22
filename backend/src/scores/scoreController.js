const Score = require('./scoreModels');

exports.createScore = async (playerId, score) => {
    try {
        if (typeof score !== 'number') {
            throw new Error('Score inválido.');
        }

        const existingScore = await Score.findByPlayerId(playerId);
        if (existingScore) {
            throw new Error('Score já cadastrado.');
        }

        return await Score.create(playerId, score);
    } catch (error) {
        console.error("Erro em createScore:", error);
        throw error;
    }
};

exports.verifyScore = async (req, res) => {
    try {
        const { id: playerId } = req.session.user;
        const score = await Score.findByPlayerId(playerId);

        if (!score)
            return res.status(404).json({ message: 'Score não encontrado.' });

        return res.status(200).json({
            message: 'Score encontrado com sucesso!',
            score
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar score.' });
    }
};

exports.updateScore = async (req, res) => {
    try {
        const { id: userId } = req.session.user;
        const { score } = req.body;

        if (typeof score !== 'number')
            return res.status(400).json({ message: 'Score inválido.' });

        const existingScore = await Score.findByPlayerId(userId);

        if (!existingScore) {
            const newScore = await Score.create(userId, score);
            return res.status(201).json({
                message: 'Score criado com sucesso!',
                score: newScore
            });
        }

        if (existingScore.score >= score) {
            return res.status(200).json({
                message: 'Recorde não foi atingido.',
                currentScore: existingScore
            });
        }

        const updatedScore = await Score.update(userId, score);

        return res.status(200).json({
            message: 'Score atualizado com sucesso!',
            score: updatedScore
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar score.' });
    }
};

exports.showTopScores = async (req, res) => {
    try {
        const topScores = await Score.getTopScores();
        return res.status(200).json({
            message: 'Top scores encontrados com sucesso!',
            scores: topScores
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar top scores.' });
    }
};
