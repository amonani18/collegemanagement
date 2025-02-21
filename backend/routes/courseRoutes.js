import express from 'express';
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getEnrolledCourses,
    updateCourse
} from '../controllers/courseController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import Course from '../models/Course.js';

const router = express.Router();

// Public routes
router.get('/', getAllCourses);

// Protected routes (student)
router.get('/my-courses', protect, getEnrolledCourses);

// Enroll in a course
router.post('/enroll/:courseId', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        course.students.push(req.user._id);
        await course.save();
        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Drop a course
router.delete('/drop/:courseId', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const studentIndex = course.students.indexOf(req.user._id);
        if (studentIndex === -1) {
            return res.status(400).json({ message: 'Not enrolled in this course' });
        }

        course.students.splice(studentIndex, 1);
        await course.save();
        res.json({ message: 'Successfully dropped course' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin routes
router.post('/', protect, admin, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

export default router;
