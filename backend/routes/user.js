const express = require('express');
const { signupUser, loginUser, verifyOTP, resendOTP } = require('../controllers/userController');

const router = express.Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// verify OTP route
router.post('/verify-otp', verifyOTP);

// resend OTP route
router.post('/resend-otp', resendOTP);

module.exports = router; 