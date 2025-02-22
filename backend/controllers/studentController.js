import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

export const registerStudent = async (req, res) => {
    try {
        const { studentNumber, password, firstName, lastName, email, program } = req.body;
        
        // Check if student already exists
        const studentExists = await Student.findOne({ 
            $or: [{ email }, { studentNumber }] 
        });

        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({ 
            studentNumber, 
            password: hashedPassword, 
            firstName, 
            lastName, 
            email, 
            program 
        });
        
        await student.save();
        res.status(201).json({ message: "Student Registered!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const loginStudent = async (req, res) => {
    try {
        const { studentNumber, password } = req.body;
        
        console.log('Login attempt with:', { studentNumber, password: '***' });

        // Find student by student number
        const student = await Student.findOne({ studentNumber });
        if (!student) {
            console.log('No student found with number:', studentNumber);
            return res.status(401).json({ message: "Invalid student number or password" });
        }

        console.log('Student found:', { 
            id: student._id,
            studentNumber: student.studentNumber,
            hashedPassword: student.password.substring(0, 10) + '...'
        });

        // Verify password
        const isMatch = await bcrypt.compare(password, student.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch for student:', studentNumber);
            return res.status(401).json({ message: "Invalid student number or password" });
        }

        // Create token
        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Token created:', token.substring(0, 20) + '...');

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Send response
        res.json({
            message: "Login successful",
            student: {
                id: student._id,
                studentNumber: student.studentNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email
            },
            token
        });

        console.log('Login successful for student:', studentNumber);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error during login" });
    }
};

export const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
