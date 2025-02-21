import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Admin from '../models/Admin.js';

const router = express.Router();

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.isAdmin) {
            const admin = await Admin.findById(decoded.id).select('-password');
            if (!admin) {
                return res.status(401).json({ message: "Not authorized" });
            }
            req.user = admin;
            req.user.isAdmin = true;
        } else {
            const student = await Student.findById(decoded.id).select('-password');
            if (!student) {
                return res.status(401).json({ message: "Not authorized" });
            }
            req.user = student;
        }
        
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
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
