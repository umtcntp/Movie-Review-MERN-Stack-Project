const express = require('express');
const router = express.Router();
const {signup, signin, logout, userProfile} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');


router.post('/signup',signup);  //  /api/signup
router.post('/signin',signin);  //  /api/signin
router.get('/logout',logout);  //  /api/logout
router.get('/me', isAuthenticated, userProfile); //  /api/me

module.exports = router;
