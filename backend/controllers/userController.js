const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// signup user
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        const user = await User.create({ 
            name,
            email, 
            password: hash,
            otp,
            otpExpiry
        });

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Workout Buddy - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1aac83;">Welcome to Workout Buddy!</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <h1 style="color: #1aac83; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't create this account, you can safely ignore this email.</p>
                    <p>Best regards,<br>The Workout Buddy Team</p>
                </div>
            `
        });

        res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
        }

        if (Date.now() > user.otpExpiry) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (otp !== user.otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Send welcome email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Welcome to Workout Buddy - Email Verified!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1aac83;">Welcome to Workout Buddy!</h2>
                    <p>Hi ${user.name},</p>
                    <p>Your email has been successfully verified! You can now start tracking your workouts.</p>
                    <p>Here are some things you can do:</p>
                    <ul>
                        <li>Add your first workout</li>
                        <li>Track your progress</li>
                        <li>Set fitness goals</li>
                    </ul>
                    <p>Best regards,<br>The Workout Buddy Team</p>
                </div>
            `
        });

        // Create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '3d' });

        res.status(200).json({ name: user.name, email: user.email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// resend OTP
const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send new OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Workout Buddy - New OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1aac83;">New OTP Requested</h2>
                    <p>Hi ${user.name},</p>
                    <p>Here is your new OTP to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <h1 style="color: #1aac83; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                    <p>Best regards,<br>The Workout Buddy Team</p>
                </div>
            `
        });

        res.status(200).json({ message: 'New OTP sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'No such user' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: 'Please verify your email before logging in' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '3d' });

        res.status(200).json({ name: user.name, email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { signupUser, loginUser, verifyOTP, resendOTP }; 