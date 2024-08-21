const express = require('express');
const signUpController = require('../controllers/signUpController');
const signInController = require('../controllers/signInController');

const router = express.Router();


router.post('/signup', signUpController.signUp);


router.post('/signin', signInController.signIn);

module.exports = router;
