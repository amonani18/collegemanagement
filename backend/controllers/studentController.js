import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

export const registerStudent = async (req, res) => {
    try {
        const { studentNumber, password, firstName, lastName, email, program } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({ studentNumber, password: hashedPassword, firstName, lastName, email, program });
        await student.save();

        res.status(201).json({ message: "Student Registered!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const loginStudent = async (req, res) => {
    const { studentNumber, password } = req.body;
    const student = await Student.findOne({ studentNumber });

    if (!student || !(await bcrypt.compare(password, student.password))) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie('token', token, { httpOnly: true }).json({ message: "Login Successful" });
};
