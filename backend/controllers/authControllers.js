const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        if (!name || name.length < 20 || name.length > 60)
            return res.status(400).json({ message: 'Invalid name length' });
        if (!address || address.length > 400)
            return res.status(400).json({ message: 'Invalid address' });
        if (!password || !/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password))
            return res.status(400).json({ message: 'Password must have 1 uppercase and 1 special char' });

        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(name, email, hashedPassword, address);

        res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Signup failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Login failed' });
    }
};
