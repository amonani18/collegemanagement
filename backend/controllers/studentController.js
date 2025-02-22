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
        
        // Find student by student number
        const student = await Student.findOne({ studentNumber });
        if (!student) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign(
            { id: student._id },
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

        // Send response
        res.json({
            message: "Login successful",
            student: {
                id: student._id,
                studentNumber: student.studentNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
