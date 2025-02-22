import express from 'express';
import { loginStudent, registerStudent } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import Student from '../models/Student.js';

const router = express.Router();

// Auth routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Protected routes
router.get('/me', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Add this route for testing
router.get('/check/:studentNumber', async (req, res) => {
    try {
        const student = await Student.findOne({ 
            studentNumber: req.params.studentNumber 
        }).select('-password');
        
        if (student) {
            res.json({ 
                exists: true, 
                student: {
                    studentNumber: student.studentNumber,
                    firstName: student.firstName,
                    lastName: student.lastName
                }
            });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
