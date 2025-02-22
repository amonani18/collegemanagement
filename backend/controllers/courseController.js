import Course from '../models/Course.js';

export const createCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;

        // Convert courseCode to uppercase
        const upperCourseCode = courseCode.toUpperCase();

        // Check if course with same code and section exists
        const existingCourseWithSection = await Course.findOne({ 
            courseCode: upperCourseCode, 
            section: section 
        });

        if (existingCourseWithSection) {
            return res.status(400).json({ 
                message: 'A course with this code and section already exists',
                type: 'DUPLICATE_SECTION'
            });
        }

        // Check if course code exists to get the course name
        const existingCourse = await Course.findOne({ courseCode: upperCourseCode });
        
        // If course exists, use its name, otherwise use the provided name
        const finalCourseName = existingCourse ? existingCourse.courseName : courseName;

        const course = new Course({
            courseCode: upperCourseCode,
            courseName: finalCourseName,
            section,
            semester,
            students: []
        });

        await course.save();
        
        res.status(201).json({ 
            message: 'Course created successfully', 
            course,
            isNewCourse: !existingCourse
        });
    } catch (error) {
        console.error('Create course error:', error);
        if (error.code === 11000) {
            res.status(400).json({ 
                message: 'A course with this code and section already exists',
                type: 'DUPLICATE_SECTION'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
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

// Helper function to check if student is enrolled in any section of a course
const isEnrolledInAnyCourseSection = async (courseCode, studentId) => {
    const courses = await Course.find({ 
        courseCode: courseCode.toUpperCase(),
        students: studentId 
    });
    return courses.length > 0;
};

export const enrollInCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if student is already enrolled in any section of this course
        const isEnrolled = await isEnrolledInAnyCourseSection(course.courseCode, studentId);
        if (isEnrolled) {
            return res.status(400).json({ 
                message: 'You are already enrolled in another section of this course'
            });
        }

        // Check if student is already enrolled in this specific section
        if (course.students.includes(studentId)) {
            return res.status(400).json({ 
                message: 'Already enrolled in this section'
            });
        }

        course.students.push(studentId);
        await course.save();
        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCourseSection = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { section } = req.body;
        const studentId = req.user._id;

        // Find the current course
        const currentCourse = await Course.findById(courseId);
        if (!currentCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find the target section
        const targetSection = await Course.findOne({
            courseCode: currentCourse.courseCode,
            section: section
        });

        if (!targetSection) {
            return res.status(404).json({ message: 'Target section not found' });
        }

        // Check if student is already in the target section
        if (targetSection.students.includes(studentId)) {
            return res.status(400).json({ message: 'Already enrolled in this section' });
        }

        // Remove student from current section
        currentCourse.students = currentCourse.students.filter(
            student => student.toString() !== studentId.toString()
        );
        await currentCourse.save();

        // Add student to new section
        targetSection.students.push(studentId);
        await targetSection.save();

        res.json({ 
            message: 'Course section updated successfully',
            newSection: targetSection.section
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
