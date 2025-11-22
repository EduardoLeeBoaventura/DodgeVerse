const pool = require('../database')

const Score = {
    async create(playerId, score){
        const ScoreResult = await pool.query(
            'INSERT INTO scores (player_id, score) VALUES ($1, $2) RETURNING *',
            [playerId, score]
        );
        return ScoreResult.rows[0];
    },

    async update(userId, score) {
        const ScoreResult = await pool.query(
            'UPDATE scores SET score = $1 WHERE player_id = $2 RETURNING *',
            [score, userId]
        );
        return ScoreResult.rows[0];
    },


    async getScorePlayer(playerId){
        const ScoreResult = await pool.query(
            `SELECT s.*, to_jsonb(u) AS user
             FROM scores s
             INNER JOIN users u ON s.player_id = u.id
             WHERE s.player_id = $1`,
            [playerId]
        );
        return ScoreResult.rows;
    },

    async findByPlayerId(playerId){
        const ScoreResult = await pool.query(
            `SELECT * FROM scores WHERE player_id = $1`,
            [playerId]
        );
        return ScoreResult.rows[0];
    },

    async getTopScores(limit = 15){
        const ScoreResult = await pool.query(
            `SELECT s.*, to_jsonb(u) AS user
             FROM scores s
             INNER JOIN users u ON s.player_id = u.id
             ORDER BY s.score DESC
             LIMIT $1`,
            [limit]
        );
        return ScoreResult.rows;
    }
};

module.exports = Score;