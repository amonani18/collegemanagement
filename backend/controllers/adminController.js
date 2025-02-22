import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token with isAdmin flag
        const token = jwt.sign(
            { 
                id: admin._id,
                isAdmin: true 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({ 
            message: "Admin login successful",
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message });
    }
}; 