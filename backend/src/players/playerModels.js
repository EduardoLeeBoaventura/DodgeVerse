const pool = require('../database')

const Player = {
    async create(name, email, password){
        const PlayerResult = await pool.query(
            'INSERT INTO players (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        return PlayerResult.rows[0];
    },

    async findByEmail(email){
        const PlayerResult = await pool.query(
            'SELECT * FROM players WHERE email = $1',
            [email]
        );
        return PlayerResult.rows[0];
    }
};

module.exports = Player;