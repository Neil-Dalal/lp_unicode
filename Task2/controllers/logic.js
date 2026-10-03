const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const User = require('../models/User');

const generateNewAccessToken = async (req, res, next) => {
    try {
        const { token } = req.body; 

        if (!token) {
            return res.status(401).json({ message: "Refresh token is required" });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            { userId: decoded.userId }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );

        res.status(200).json({ 
            message: "Token refreshed successfully",
            accessToken: newAccessToken 
        });

    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token. Please log in again." });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body; 
        const checkUser = await User.findOne({ email });
       
        if(!checkUser){
           return res.status(400).json({ message: "Invalid username" });
        }
        
        const checkPass = await bcrypt.compare(password, checkUser.password);
        if(!checkPass){
            return res.status(400).json({ message: "Invalid password" });
        }
        
        await sendEmail({
            email: checkUser.email,
            subject: 'New Login Detected',
            message: 'We noticed a new login to your account. If this was you, no action is needed.'
        });

        const accessToken = jwt.sign(
            { userId: checkUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' } 
        );

        const refreshToken = jwt.sign(
            { userId: checkUser._id }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '7d' } 
        );

        res.status(200).json({ 
            message: "Login successful",
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        next(error); 
    }
};

const register = async (req, res, next) => { 
    try {
        const { name, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword 
        });
        
        await sendEmail({
            email: newUser.email,
            subject: 'Welcome to the App!',
            message: `Hello ${newUser.name}, thank you for registering!`
        });      
        
        res.status(201).json({ 
            message: "User successfully registered!",
            user: newUser 
        });
    } catch (error) {
        next(error); 
    }
};

module.exports = { login, register, generateNewAccessToken };