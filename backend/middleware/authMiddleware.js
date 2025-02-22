import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

const router = express.Router();

export const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check for token in cookies first
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        // Then check Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const student = await Student.findById(decoded.id).select('-password');
            
            if (!student) {
                return res.status(401).json({ message: "Not authorized" });
            }
            
            req.user = student;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as admin' });
    }
};

// Login Route
router.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // Authenticate user (check email and password)
    const user = await Student.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token in cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // 'secure' should be true in production
    res.status(200).json({ message: 'Login successful' });
});

export { router };

