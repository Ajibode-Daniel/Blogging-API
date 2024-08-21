const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { check, validationResult } = require('express-validator');


const signUp = [
    // Validation rules
    check('first_name').notEmpty().withMessage('First name is required'),
    check('last_name').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    
    
async (req, res) => {

        // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    async (req, res) => { 
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
    };
};
}
]

module.exports = { signUp };