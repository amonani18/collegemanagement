import express from 'express';
import { loginAdmin } from '../controllers/adminController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import Student from '../models/Student.js';

const router = express.Router();

router.post('/login', loginAdmin);

// Get all students (admin only)
router.get('/students', protect, admin, async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new student (admin only)
router.post('/students', protect, admin, async (req, res) => {
    try {
        const { studentNumber, firstName, lastName, email, program } = req.body;

        // Check if student already exists
        const studentExists = await Student.findOne({ 
            $or: [{ email }, { studentNumber }] 
        });

        if (studentExists) {
            return res.status(400).json({ 
                message: 'Student with this email or student number already exists' 
            });
        }

        const student = await Student.create({
            studentNumber,
            firstName,
            lastName,
            email,
            program,
            password: studentNumber // Default password is student number
        });

        res.status(201).json({
            message: 'Student created successfully',
            student: {
                id: student._id,
                studentNumber: student.studentNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                program: student.program
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update student (admin only)
router.put('/students/:id', protect, admin, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const { firstName, lastName, email, program } = req.body;
        student.firstName = firstName || student.firstName;
        student.lastName = lastName || student.lastName;
        student.email = email || student.email;
        student.program = program || student.program;

        await student.save();
        res.json({ 
            message: 'Student updated successfully',
            student: {
                id: student._id,
                studentNumber: student.studentNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                program: student.program
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete student (admin only)
router.delete('/students/:id', protect, admin, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.remove();
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add this route to your existing adminRoutes.js
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

export default router; 