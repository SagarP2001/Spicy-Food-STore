const pool = require('./db');

const createUser = async (name, email, hashedPassword, address) => {
    const res = await pool.query(
        'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, email, hashedPassword, address, 'user']
    );
    return res.rows[0];
};

const findUserByEmail = async (email) => {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
};

module.exports = { createUser, findUserByEmail };
