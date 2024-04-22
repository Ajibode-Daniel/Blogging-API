const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const signUp = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({ first_name, last_name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { signUp };
