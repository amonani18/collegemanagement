import Course from '../models/Course.js';

export const createCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;

        // Check if course with same code and section exists
        const existingCourse = await Course.findOne({ courseCode, section });
        if (existingCourse) {
            return res.status(400).json({ 
                message: 'A course with this code and section already exists',
                type: 'DUPLICATE_SECTION'
            });
        }

        // Check if course code exists to get the course name
        const existingCourseCode = await Course.findOne({ courseCode });
        const finalCourseName = existingCourseCode ? existingCourseCode.courseName : courseName;

        const course = new Course({
            courseCode,
            courseName: finalCourseName,
            section,
            semester,
            students: []
        });

        await course.save();
        res.status(201).json({ 
            message: 'Course created successfully', 
            course 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('students', 'studentNumber firstName lastName email program');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const courses = await Course.find({ students: req.user._id });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.courseCode = courseCode || course.courseCode;
        course.courseName = courseName || course.courseName;
        course.section = section || course.section;
        course.semester = semester || course.semester;

        await course.save();
        res.json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.remove();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
